/*global exports, window, document, setTimeout, Burner, Modernizr */
/*jshint supernew:true */
/** @namespace */
var System = {
  name: 'System'
};

/**
 * Holds a transform property based on supportedFeatures.
 * @private
 */
System._stylePosition = '';

/**
 * Increments each time update() is executed.
 */
System.clock = 0;

/**
 * A map of supported browser features.
 */
System.supportedFeatures = {
  csstransforms: true,
  csstransforms3d: true
};

/**
 * Stores references to all items in the system.
 * @private
 */
System._records = {
  lookup: {},
  list: []
};

/**
 * Stores references to all items in the system.
 * @private
 */
System._caches = {};

/**
 * Used to create unique ids.
 * @private
 */
System._idCount = 0;

/**
 * Holds the current and last mouse/touch positions relative
 * to the browser window. Also, holds the current mouse velocity.
 * @public
 */
System.mouse = {
  location: new exports.Vector(),
  lastLocation: new exports.Vector(),
  velocity: new exports.Vector()
};

/**
 * Stores the time in milliseconds of the last
 * resize event. Used to pause renderer during resize
 * and resume when resize is complete.
 *
 * @private
 */
System._resizeTime = 0;

/**
 * Initializes the system and starts the update loop.
 *
 * @param {Function} opt_setup= Creates the initial system conditions.
 * @param {Object} opt_worldOptions= Optional properties for the world.
 * @param {Object} opt_world= A reference to a DOM element representing the System world.
 * @param {Function} opt_supportedFeatures= A map of supported browser features.
 * @param {boolean} opt_noStartLoop= If true, _update is not called. Use to setup a System
 *    and start the _update loop at a later time.
 */
System.init = function(opt_setup, opt_worldOptions, opt_world, opt_supportedFeatures, opt_noStartLoop) {

  var setup = opt_setup || function () {},
      world = opt_world || document.body,
      worldOptions = opt_worldOptions || {},
      supportedFeatures = opt_supportedFeatures || null,
      noStartLoop = !opt_noStartLoop ? false : true;

  // check if supportedFeatures were passed
  if (!supportedFeatures) {
    this.supportedFeatures = System._getSupportedFeatures();
  } else if (typeof supportedFeatures === 'object' &&
      typeof supportedFeatures.csstransforms !== 'undefined' &&
      typeof supportedFeatures.csstransforms3d !== 'undefined') {
    this.supportedFeatures = supportedFeatures;
  } else {
    throw new Error('System: supportedFeatures should be passed as an object.');
  }

  if (this.supportedFeatures.csstransforms3d) {
    this._stylePosition = '-webkit-transform: translate3d(<x>px, <y>px, 0) rotate(<angle>deg) scale(<scale>, <scale>); -moz-transform: translate3d(<x>px, <y>px, 0) rotate(<angle>deg) scale(<scale>, <scale>); -o-transform: translate3d(<x>px, <y>px, 0) rotate(<angle>deg) scale(<scale>, <scale>); -ms-transform: translate3d(<x>px, <y>px, 0) rotate(<angle>deg) scale(<scale>, <scale>);';
  } else if (this.supportedFeatures.csstransforms) {
    this._stylePosition = '-webkit-transform: translate(<x>px, <y>px) rotate(<angle>deg) scale(<scale>, <scale>); -moz-transform: translate(<x>px, <y>px) rotate(<angle>deg) scale(<scale>, <scale>); -o-transform: translate(<x>px, <y>px) rotate(<angle>deg) scale(<scale>, <scale>); -ms-transform: translate(<x>px, <y>px) rotate(<angle>deg) scale(<scale>, <scale>);';
  } else {
    this._stylePosition = 'position: absolute; left: <x>px; top: <y>px;';
  }

  document.body.onorientationchange = System.updateOrientation;

  System._records.list.push(new exports.World(world, worldOptions));
  System.updateCache(System._records.list[0]);

  // save the current and last mouse position
  this._addEvent(document, 'mousemove', function(e) {
    System._recordMouseLoc.call(System, e);
  });

  // save the current and last touch position
  this._addEvent(window, 'touchstart', function(e) {
    System._recordMouseLoc.call(System, e);
  });
  this._addEvent(window, 'touchmove', function(e) {
    System._recordMouseLoc.call(System, e);
  });
  this._addEvent(window, 'touchend', function(e) {
    System._recordMouseLoc.call(System, e);
  });

  // listen for window resize
  this._addEvent(window, 'resize', function(e) {
    System._resize.call(System, e);
  });

  // listen for device motion events (ie. accelerometer)
  this._addEvent(window, 'devicemotion', function(e) {

    var world = System._records.list[0],
        x = e.accelerationIncludingGravity.x,
        y = e.accelerationIncludingGravity.y;

    if (window.orientation === 0) {
      world.gravity.x = x;
      world.gravity.y = y * -1;
    } else if (window.orientation === -90) {
      world.gravity.x = y;
      world.gravity.y = x;
    } else {
      world.gravity.x = y * -1;
      world.gravity.y = x * -1;
    }
  });

  // listen for key up
  this._addEvent(window, 'keyup', function(e) {
    System._keyup.call(System, e);
  });

  this._setup = setup;
  this._setup.call(this);

  if (!noStartLoop) {
    this._update();
  }
};

/**
 * Adds an object to the system.
 *
 * @param {Object} opt_options= Object properties.
 */
System.add = function(klass, opt_options) {

  var i, max, last, parentNode, pool,
      records = this._records.list,
      recordsLookup = this._records.lookup,
      options = opt_options || {};

  options.world = records[0];

  // recycle object if one is available
  pool = this.getAllItemsByName(klass, options.world._pool);

  if (pool.length) {
    for (i = 0, max = options.world._pool.length; i < max; i++) {
      if (options.world._pool[i].name === klass) {
        records[records.length] = options.world._pool.splice(i, 1)[0];
        records[records.length - 1].options = options;
        System._updateCacheLookup(records[records.length - 1], true);
        break;
      }
    }
  } else {
    if (Burner[klass]) {
      records[records.length] = new Burner[klass](options);
    } else {
      records[records.length] = new Burner.Classes[klass](options);
    }
  }
  last = records.length - 1;
  parentNode = records[last].el.parentNode;
  recordsLookup[records[last].id] = parentNode;
  records[last].reset(options);
  records[last].init(options);
  return records[last];
};

/**
 * Starts the render loop.
 */
System.start = function() {
  this._update();
};

/**
 * Adds an object to a cache based on its constructor name.
 *
 * @param {Object} obj An object.
 * returns {Object} The cache that received the passed object.
 */
System.updateCache = function(obj) {

  // Create cache object, unless it already exists
  var cache = System._caches[obj.name] ||
      (System._caches[obj.name] = {
        lookup: {},
        list: []
      });

  cache.list[cache.list.length] = obj;
  cache.lookup[obj.id] = true;
  return cache;
};

/**
 * Assigns the given 'val' to the given object's record in System._caches.
 *
 * @param {Object} obj An object.
 * @param {Boolean} val True if object is active, false if object is destroyed.
 */
System._updateCacheLookup = function(obj, val) {

  var cache = System._caches[obj.name];

  if (cache) {
    cache.lookup[obj.id] = val;
  }
};

/**
 * Returns the total number of items in the system.
 *
 * @returns {number} Total number of items.
 */
System.count = function() {
  return this._records.list.length;
};

/**
 * Returns the first world in the system.
 *
 * @returns {null|Object} A world.
 */
System.firstWorld = function() {
  return this._caches.World ? this._caches.World.list[0] : null;
};

/**
 * Returns the last world in the system.
 *
 * @returns {null|Object} A world.
 */
System.lastWorld = function() {
  return this._caches.World ? this._caches.World.list[this._caches.World.list.length - 1] : null;
};

/**
 * Returns the first item in the system.
 *
 * @returns {Object} An item.
 */
System.firstItem = function() {
  return this._records.list[0];
};

/**
 * Returns the last item in the system.
 *
 * @returns {Object} An item.
 */
System.lastItem = function() {
  return this._records.list[this._records.list.length - 1];
};

/**
 * Iterates over objects in the system and calls step() and draw().
 *
 * @private
 */
System._update = function() {

  var i, records = System._records.list, record;

  // check for resize stop
  if (System._resizeTime && new Date().getTime() - System._resizeTime > 100) {
    System._resizeTime = 0;
    System.firstWorld().pauseStep = false;
  }

  // step
  for (i = records.length - 1; i >= 0; i -= 1) {
    record = records[i];
    if (record.step && !record.world.pauseStep) {
      record.step();
    }
  }

  // draw
  for (i = records.length - 1; i >= 0; i -= 1) {
    record = records[i];
    if (record.draw && !record.world.drawStep) {
      record.draw();
    }
  }

  System.clock++;
  window.requestAnimFrame(System._update);
};

/**
 * Pauses the system and processes one step in records.
 * @private
 */
System._stepForward = function() {

  var i, records = System._records.list,
      world = this._records.list[0];

  world.pauseStep = true;

  for (i = records.length - 1; i >= 0; i -= 1) {
    if (records[i].step) {
      records[i].step();
    }
  }
  for (i = records.length - 1; i >= 0; i -= 1) {
    if (records[i].draw) {
      records[i].draw();
    }
  }
  System.clock++;
};

/**
 * Resets the system.
 *
 * @param {boolean} opt_noRestart= Pass true to not restart the system.
 * @private
 */
System._resetSystem = function(opt_noRestart) {

  var world = this._records.list[0];

  world.pauseStep = false;
  world.pauseDraw = false;

  while(world.el.firstChild) {
    world.el.removeChild(world.el.firstChild);
  }

  System._caches = {};

  System._destroyAllItems();

  System._idCount = 0;

  System.mouse = {
    location: new exports.Vector(),
    lastLocation: new exports.Vector(),
    velocity: new exports.Vector()
  };

  System._resizeTime = 0;

  if (!opt_noRestart) {
    System._setup.call(System);
  }
};

/**
 * Destroys the system.
 * @private
 */
System._destroySystem = function() {
  this._resetSystem(true);
  this._destroyAllWorlds();
  this.clock = 0;
  this._idCount = 0;
};

/**
 * Removes all items in all worlds.
 *
 * @private
 */
System._destroyAllItems = function() {

  var i, items = this._records.list;

  for (i = items.length - 1; i >= 0; i--) {
    if (items[i].name !== 'World') {
      items.splice(i, 1);
    }
  }
};

/**
 * Removes all worlds.
 *
 * @private
 */
System._destroyAllWorlds = function() {

  var i, item, items = this._records.list;

  for (i = items.length - 1; i >= 0; i--) {
    item = items[i];
    if (item.name === 'World') {
      item.el.parentNode.removeChild(item.el);
      items.splice(i, 1);
    }
  }
};

/**
 * Removes an item from a world.
 *
 * @param {Object} obj The item to remove.
 */
System.destroyItem = function (obj) {

  var i, max, records = this._records.list;

  for (i = 0, max = records.length; i < max; i++) {
    if (records[i].id === obj.id) {
      records[i].el.style.visibility = 'hidden'; // hide item
      records[i].el.style.top = '-5000px';
      records[i].el.style.left = '-5000px';
      records[i].world._pool[records[i].world._pool.length] = records.splice(i, 1)[0]; // move record to pool array
      System._updateCacheLookup(obj, false);
      break;
    }
  }
};

/**
 * Returns an array of items created from the same constructor.
 *
 * @param {string} name The 'name' property.
 * @param {Array} [opt_list = this._records] An optional list of items.
 * @returns {Array} An array of items.
 */
System.getAllItemsByName = function(name, opt_list) {

  var i, max, arr = [],
      list = opt_list || this._records.list;

  for (i = 0, max = list.length; i < max; i++) {
    if (list[i].name === name) {
      arr[arr.length] = list[i];
    }
  }
  return arr;
};

/**
 * Returns an array of items with an attribute that matches the
 * passed 'attr'. If 'opt_val' is passed, 'attr' must equal 'val'.
 *
 * @param {string} attr The property to match.
 * @param {*} [opt_val=] The 'attr' property must equal 'val'.
 * @returns {Array} An array of items.
 */
System.getAllItemsByAttribute = function(attr, opt_val) {

  var i, max, arr = [], records = this._records.list,
      val = opt_val !== undefined ? opt_val : null;

  for (i = 0, max = records.length; i < max; i++) {
    if (records[i][attr] !== undefined) {
      if (val !== null && records[i][attr] !== val) {
        continue;
      }
      arr[arr.length] = records[i];
    }
  }
  return arr;
};

/**
 * Updates the properties of items created from the same constructor.
 *
 * @param {string} name The constructor name.
 * @param {Object} props A map of properties to update.
 * @returns {Array} An array of items.
 * @example
 * System.updateElementPropsByName('point', {
 *    color: [0, 0, 0],
 *    scale: 2
 * }); // all points will turn black and double in size
 */
System.updateItemPropsByName = function(name, props) {

  var i, max, p, arr = this.getAllItemsByName(name);

  for (i = 0, max = arr.length; i < max; i++) {
    for (p in props) {
      if (props.hasOwnProperty(p)) {
        arr[i][p] = props[p];
      }
    }
  }
  return arr;
};

/**
 * Finds an item by its 'id' and returns it.
 *
 * @param {string|number} id The item's id.
 * @returns {Object} The item.
 */
System.getItem = function(id) {

  var i, max, records = this._records.list;

  for (i = 0, max = records.length; i < max; i += 1) {
    if (records[i].id === id) {
      return records[i];
    }
  }
  return null;
};

/**
 * Updates the properties of an item.
 *
 * @param {Object} item The item.
 * @param {Object} props A map of properties to update.
 * @returns {Object} The item.
 * @example
 * System.updateItem(myItem, {
 *    color: [0, 0, 0],
 *    scale: 2
 * }); // item will turn black and double in size
 */
System.updateItem = function(item, props) {

  for (var p in props) {
    if (props.hasOwnProperty(p)) {
      item[p] = props[p];
    }
  }
  return item;
};

/**
 * Repositions all items relative to the window size and resets the world bounds.
 */
System._resize = function() {

  var i, max, records = this._records.list, record,
      screenDimensions = this.getWindowSize(),
      world = this.firstWorld();

  this._resizeTime = new Date().getTime();
  world.pauseStep = true;

  for (i = 0, max = records.length; i < max; i++) {
    record = records[i];
    if (record.name !== 'World' && record.world.boundToWindow && record.location) {
      record.location.x = screenDimensions.width * (record.location.x / world.width);
      record.location.y = screenDimensions.height * (record.location.y / world.height);
    }
  }

  world._setBounds();
};

/**
 * Handles keyup events.
 *
 * @param {Object} e An event.
 */
System._keyup = function(e) {

  var world = this._records.list[0];

  switch(e.keyCode) {
    case 39:
      System._stepForward();
      break;
    case 80: // p; pause/play
      world.pauseStep = !world.pauseStep;
      break;
    case 82: // r; reset
      System._resetSystem();
      break;
    case 83: // s; reset
      System._toggleStats();
      break;
  }
};

/**
 * Increments idCount and returns the value.
 */
System.getNewId = function() {
  this._idCount++;
  return this._idCount;
};

/**
 * Adds an event listener to a DOM element.
 *
 * @param {Object} target The element to receive the event listener.
 * @param {string} eventType The event type.
 * @param {function} The function to run when the event is triggered.
 * @private
 */
System._addEvent = function(target, eventType, handler) {
  if (target.addEventListener) { // W3C
    target.addEventListener(eventType, handler, false);
  } else if (target.attachEvent) { // IE
    target.attachEvent("on" + eventType, handler);
  }
};

/**
 * Saves the mouse/touch location relative to the browser window.
 *
 * @private
 */
System._recordMouseLoc = function(e) {

  var touch, world = this.firstWorld();

  this.mouse.lastLocation.x = this.mouse.location.x;
  this.mouse.lastLocation.y = this.mouse.location.y;

  if (e.changedTouches) {
    touch = e.changedTouches[0];
  }

  /**
   * Mapping window size to world size allows us to
   * lead an agent around a world that's not bound
   * to the window.
   */
  if (e.pageX && e.pageY) {
    this.mouse.location.x = this.map(e.pageX, 0, window.innerWidth, 0, world.width);
    this.mouse.location.y = this.map(e.pageY, 0, window.innerHeight, 0, world.height);
  } else if (e.clientX && e.clientY) {
    this.mouse.location.x = this.map(e.clientX, 0, window.innerWidth, 0, world.width);
    this.mouse.location.y = this.map(e.clientY, 0, window.innerHeight, 0, world.height);
  } else if (touch) {
    this.mouse.location.x = touch.pageX;
    this.mouse.location.y = touch.pageY;
  }

  this.mouse.velocity.x = this.mouse.lastLocation.x - this.mouse.location.x;
  this.mouse.velocity.y = this.mouse.lastLocation.y - this.mouse.location.y;
};

/**
 * Extends the properties and methods of a superClass onto a subClass.
 *
 * @param {Object} subClass The subClass.
 * @param {Object} superClass The superClass.
 */
System.extend = function(subClass, superClass) {
  function F() {}
  F.prototype = superClass.prototype;
  subClass.prototype = new F;
  subClass.prototype.constructor = subClass;
};

/**
 * Determines the size of the browser window.
 *
 * @returns {Object} The current browser window width and height.
 * @private
 */
System.getWindowSize = function() {

  var d = {
    'width' : false,
    'height' : false
  };

  if (typeof(window.innerWidth) !== 'undefined') {
    d.width = window.innerWidth;
    d.height = window.innerHeight;
  } else if (typeof(document.documentElement) !== 'undefined' &&
      typeof(document.documentElement.clientWidth) !== 'undefined') {
    d.width = document.documentElement.clientWidth;
    d.height = document.documentElement.clientHeight;
  } else if (typeof(document.body) !== 'undefined') {
    d.width = document.body.clientWidth;
    d.height = document.body.clientHeight;
  }
  return d;
};

/**
 * Handles orientation evenst and forces the world to update its bounds.
 */
System.updateOrientation = function() {
  setTimeout(function() {
   System._records.list[0]._setBounds();
  }, 500);
};

/**
 * Generates a psuedo-random number within a range.
 *
 * @param {number} low The low end of the range.
 * @param {number} high The high end of the range.
 * @param {boolean} [flt] Set to true to return a float.
 * @returns {number} A number.
 */
System.getRandomNumber = function(low, high, flt) {
  if (flt) {
    return Math.random()*(high-(low-1)) + low;
  }
  return Math.floor(Math.random()*(high-(low-1))) + low;
};

/**
 * Toggles stats display.
 */
System._toggleStats = function() {
  if (!System._statsDisplay) {
    System._statsDisplay = new exports.StatsDisplay();
  } else if (System._statsDisplay && System._statsDisplay._active) {
    System._statsDisplay.destroy();
  } else if (System._statsDisplay && !System._statsDisplay._active) {
    System._statsDisplay = new exports.StatsDisplay();
  }
};

/**
 * Checks if the Modernizr object exists. If so, returns
 * supported transforms. If not, returns false for transforms support.
 *
 * returns {Object} A map of supported features.
 * @static
 * @private
 */
System._getSupportedFeatures = function() {

  var features;

  if (window.Modernizr) {
    features = {
      csstransforms3d: Modernizr.csstransforms3d,
      csstransforms: Modernizr.csstransforms,
      touch: Modernizr.touch
    };
  } else {
    features = {
      csstransforms3d: exports.FeatureDetector.detect('csstransforms3d'),
      csstransforms: exports.FeatureDetector.detect('csstransforms'),
      touch: exports.FeatureDetector.detect('touch')
    };
  }
  return features;
};

/**
 * Re-maps a number from one range to another.
 *
 * @param {number} value The value to be converted.
 * @param {number} min1 Lower bound of the value's current range.
 * @param {number} max1 Upper bound of the value's current range.
 * @param {number} min2 Lower bound of the value's target range.
 * @param {number} max2 Upper bound of the value's target range.
 * @returns {number} A number.
 */
System.map = function(value, min1, max1, min2, max2) { // returns a new value relative to a new range
  var unitratio = (value - min1) / (max1 - min1);
  return (unitratio * (max2 - min2)) + min2;
};

/**
 * Updates the corresponding DOM element's style property.
 */
System._draw = function(obj) {

  var cssText = exports.System.getCSSText({
    x: obj.location.x - (obj.width / 2),
    y: obj.location.y - (obj.height / 2),
    angle: obj.angle,
    scale: obj.scale || 1,
    width: obj.width,
    height: obj.height,
    color0: obj.color[0],
    color1: obj.color[1],
    color2: obj.color[2],
    colorMode: obj.colorMode,
    visibility: obj.visibility,
    opacity: obj.opacity,
    zIndex: obj.zIndex,
    borderWidth: obj.borderWidth,
    borderStyle: obj.borderStyle,
    borderColor0: obj.borderColor[0],
    borderColor1: obj.borderColor[1],
    borderColor2: obj.borderColor[2],
    borderRadius: obj.borderRadius,
    boxShadowOffsetX: obj.boxShadowOffset.x,
    boxShadowOffsetY: obj.boxShadowOffset.y,
    boxShadowBlur: obj.boxShadowBlur,
    boxShadowSpread: obj.boxShadowSpread,
    boxShadowColor0: obj.boxShadowColor[0],
    boxShadowColor1: obj.boxShadowColor[1],
    boxShadowColor2: obj.boxShadowColor[2]
  });
  obj.el.style.cssText = cssText;
};

/**
 * Concatenates a new cssText string.
 *
 * @param {Object} props A map of object properties.
 */
System.getCSSText = function(props) {
  return this._stylePosition.replace(/<x>/g, props.x).replace(/<y>/g, props.y).replace(/<angle>/g, props.angle).replace(/<scale>/g, props.scale) + 'width: ' +
      props.width + 'px; height: ' + props.height + 'px; background-color: ' +
      props.colorMode + '(' + props.color0 + ', ' + props.color1 + (props.colorMode === 'hsl' ? '%' : '') + ', ' + props.color2 + (props.colorMode === 'hsl' ? '%' : '') +'); border: ' +
      props.borderWidth + 'px ' + props.borderStyle + ' ' + props.colorMode + '(' + props.borderColor0 + ', ' + props.borderColor1 + (props.colorMode === 'hsl' ? '%' : '') + ', ' + props.borderColor2 + (props.colorMode === 'hsl' ? '%' : '') + '); border-radius: ' +
      props.borderRadius + '%; box-shadow: ' + props.boxShadowOffsetX + 'px ' + props.boxShadowOffsetY + 'px ' + props.boxShadowBlur + 'px ' + props.boxShadowSpread + 'px ' + props.colorMode + '(' + props.boxShadowColor0 + ', ' + props.boxShadowColor1 + (props.colorMode === 'hsl' ? '%' : '') + ', ' + props.boxShadowColor2 + (props.colorMode === 'hsl' ? '%' : '') + '); visibility: ' +
      props.visibility + '; opacity: ' + props.opacity + '; z-index: ' + props.zIndex + ';';
};
exports.System = System;
