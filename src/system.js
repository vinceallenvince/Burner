/*global exports, window, document, setTimeout, Burner */
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
 * Stores references to all elements in the system.
 * @private
 */
System._records = {
  lookup: {},
  list: []
};

/**
 * Stores references to all elements in the system.
 * @private
 */
System._caches = {
  lookup: {},
  list: []
};

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
 * @param {Function} opt_classes= Additional object classes that extend Item.
 * @param {Function} opt_supportedFeatures= A map of supported browser features.
 * @param {Object} opt_world= A reference to a DOM element representing the System world.
 * @param {Object} opt_worldOptions= Optional properties for the world.
 * @param {boolean} opt_startLoop= If true, _update is not called. Use to setup a System
 *    and start the _update loop at a later time.
 */
System.init = function(opt_setup, opt_classes, opt_supportedFeatures, opt_world, opt_worldOptions, opt_startLoop) {

  var i, setup = opt_setup || function () {},
      world = opt_world || document.body,
      worldOptions = opt_worldOptions || {},
      supportedFeatures = opt_supportedFeatures || {},
      startLoop = opt_startLoop || true;

  Burner.Classes = opt_classes || null;

  if (typeof supportedFeatures === 'object' &&
      typeof supportedFeatures.csstransforms !== 'undefined' &&
      typeof supportedFeatures.csstransforms3d !== 'undefined') {
    this.supportedFeatures = supportedFeatures;
  } else {
    this.supportedFeatures = {
      csstransforms: true,
      csstransforms3d: true
    };
  }

  if (this.supportedFeatures.csstransforms3d) {
    this._stylePosition = '-webkit-transform: translate3d(<x>px, <y>px, 0) rotate(<angle>deg); -moz-transform: translate3d(<x>px, <y>px, 0) rotate(<angle>deg); -o-transform: translate3d(<x>px, <y>px, 0) rotate(<angle>deg); -ms-transform: translate3d(<x>px, <y>px, 0) rotate(<angle>deg);';
  } else if (this.supportedFeatures.csstransforms) {
    this._stylePosition = '-webkit-transform: translateX(<x>px) translateY(<y>px) rotate(<angle>deg); -moz-transform: translateX(<x>px) translateY(<y>px) rotate(<angle>deg); -o-transform: translateX(<x>px) translateY(<y>px) rotate(<angle>deg); -ms-transform: translateX(<x>px) translateY(<y>px) rotate(<angle>deg);';
  } else {
    this._stylePosition = 'position: absolute; left: <x>px; top: <y>px;';
  }

  document.body.onorientationchange = System.updateOrientation;

  System._records.list.push(new exports.World(world, worldOptions));

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

  if (startLoop) {
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
  pool = this.getAllElementsByName(klass, options.world._pool);

  if (pool.length) {
    for (i = 0, max = options.world._pool.length; i < max; i++) {
      if (options.world._pool[i].name === klass) {
        records[records.length] = options.world._pool.splice(i, 1)[0];
        records[records.length - 1].options = options;
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
 * Returns the total number of items in the system.
 *
 * @returns {number} Total number of elements.
 */
System.count = function() {
  return this._records.list.length;
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
    records[0].pauseStep = false;
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
    records[i].step();
  }
  for (i = records.length - 1; i >= 0; i -= 1) {
    records[i].draw();
  }
  System.clock++;
};

/**
 * Resets the system.
 * @private
 */
System._resetSystem = function() {

  var world = this._records.list[0];

  world.pauseStep = false;
  world.pauseDraw = false;

  while(world.el.firstChild) {
    world.el.removeChild(world.el.firstChild);
  }

  System._destroyAllItems();

  System._idCount = 0;

  System.mouse = {
    location: new exports.Vector(),
    lastLocation: new exports.Vector(),
    velocity: new exports.Vector()
  };

  System._resizeTime = 0;

  System._setup.call(System);
};

/**
 * Removes all elements in all worlds.
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
 * Removes an element from a world.
 *
 * @param {Object} obj The element to remove.
 */
System.destroyItem = function (obj) {

  var i, max, records = this._records.list;

  for (i = 0, max = records.length; i < max; i++) {
    if (records[i].id === obj.id) {
      records[i].el.style.visibility = 'hidden'; // hide element
      records[i].el.style.top = '-5000px';
      records[i].el.style.left = '-5000px';
      records[i].world._pool[records[i].world._pool.length] = records.splice(i, 1)[0]; // move record to pool array
      break;
    }
  }
};

/**
 * Returns an array of elements created from the same constructor.
 *
 * @param {string} name The 'name' property.
 * @param {Array} [opt_list = this._records] An optional list of elements.
 * @returns {Array} An array of elements.
 */
System.getAllElementsByName = function(name, opt_list) {

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
 * Repositions all elements relative to the window size and resets the world bounds.
 */
System._resize = function() {

  var i, max, records = this._records.list, record,
      screenDimensions = this.getWindowSize(),
      world = records[0];

  this._resizeTime = new Date().getTime();
  world.pauseStep = true;

  for (i = 0, max = records.length; i < max; i++) {
    record = records[i];
    if (record.name !== 'World' && record.location) {
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

  var touch;

  this.mouse.lastLocation.x = this.mouse.location.x;
  this.mouse.lastLocation.y = this.mouse.location.y;

  if (e.changedTouches) {
    touch = e.changedTouches[0];
  }

  if (e.pageX && e.pageY) {
    this.mouse.location.x = e.pageX;
    this.mouse.location.y = e.pageY;
  } else if (e.clientX && e.clientY) {
    this.mouse.location.x = e.clientX;
    this.mouse.location.y = e.clientY;
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
 * Updates the corresponding DOM element's style property.
 */
System._draw = function(obj) {

  var cssText = exports.System.getCSSText({
    x: obj.location.x - (obj.width / 2),
    y: obj.location.y - (obj.height / 2),
    angle: obj.angle,
    width: obj.width,
    height: obj.height,
    color0: obj.color[0],
    color1: obj.color[1],
    color2: obj.color[2],
    colorMode: obj.colorMode,
    visibility: obj.visibility,
    opacity: obj.opacity,
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
  return this._stylePosition.replace('<x>', props.x).replace('<y>', props.y).replace('<angle>', props.angle) + 'width: ' +
      props.width + 'px; height: ' + props.height + 'px; background-color: ' +
      props.colorMode + '(' + props.color0 + ', ' + props.color1 + (props.colorMode === 'hsl' ? '%' : '') + ', ' + props.color2 + (props.colorMode === 'hsl' ? '%' : '') +'); border: ' +
      props.borderWidth + 'px ' + props.borderStyle + ' ' + props.colorMode + '(' + props.borderColor0 + ', ' + props.borderColor1 + (props.colorMode === 'hsl' ? '%' : '') + ', ' + props.borderColor2 + (props.colorMode === 'hsl' ? '%' : '') + '); border-radius: ' +
      props.borderRadius + '%; box-shadow: ' + props.boxShadowOffsetX + 'px ' + props.boxShadowOffsetY + 'px ' + props.boxShadowBlur + 'px ' + props.boxShadowSpread + 'px ' + props.colorMode + '(' + props.boxShadowColor0 + ', ' + props.boxShadowColor1 + (props.colorMode === 'hsl' ? '%' : '') + ', ' + props.boxShadowColor2 + (props.colorMode === 'hsl' ? '%' : '') + '); visibility: ' +
      props.visibility + '; opacity: ' + props.opacity + ';';
};
exports.System = System;
