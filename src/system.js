/*global exports, window, document, Modernizr, parent */
/**
 * Creates a new System.
 * @constructor
 */
function System() {
  this.name = 'system';
}

/**
 * Stores references to all elements in the system.
 * @private
 */
System._records = {
  lookup: {},
  list: []
};

/**
 * Stores references to all worlds in the system.
 * @private
 */
System._worldsCache = {
  lookup: {},
  list: []
};

/**
 * Stores additional caches.
 * @private
 */
System._Caches = {};

/**
 * Used to create unique ids.
 * @private
 */
System._idCount = 0;

/**
 * Holds the current and last mouse positions relative
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
 * Initializes the system by saving references to the system worlds and running a
 * setup script if passed. If no world is passed, uses document.body. Also listens
 * for resize events on the window.
 *
 * @param {Function} opt_setup A function to run before System's _update loop starts.
 * @param {Object|Array} opt_worlds A single reference or an array of
 *    references to DOM elements representing System worlds.
 * @parm {Object} opt_supportedFeatures Pass a map of supported browser features to
 *    override an system provided feature detection.
 * @param {boolean} opt_noStart If true, _update is not called. Use to setup a System
 *    and start the _update loop at a later time.
 * @param {boolean} opt_reset If true, user input and pubsub event listeners are not added.
 * @example This example assumes Burner lives under the 'Anim' namespace. The setup
 *    function updates the world's gravity and coefficient of friction. Passing 'null'
 *    forces the system to use document.body as the world. It overrides the system
 *    feature detection by passing its own features. It also delays starting the system.
 *
 * Anim.Burner.System.create(function() {
 *   Anim.World.update({
 *     gravity: new Anim.Vector(0, 1),
 *     c: 0.1
 *   });
 * },
 * null,
 * {
 *   csstransforms3d: Modernizr.csstransforms3d,
 *   csstransforms: Modernizr.csstransforms
 * },
 * true);
 */
System.create = function(opt_setup, opt_worlds, opt_supportedFeatures, opt_noStart) {

  var i, max, records = this._records.list,
      setup = opt_setup || function() {},
      worlds = opt_worlds, world, supportedFeatures = opt_supportedFeatures,
      noStart = opt_noStart, utils = exports.Utils,
      worldsCache = System.allWorlds(),
      worldsCacheLookup = System._worldsCache.lookup;

  System._setup = setup;
  System._worlds = worlds;
  System._noStart = noStart;

  // check if supportedFeatures were passed
  if (!supportedFeatures) {
    this.supportedFeatures = System._getSupportedFeatures();
  } else if (utils.getDataType(supportedFeatures) === 'object') {
    this.supportedFeatures = supportedFeatures;
  } else {
    throw new Error('System: supportedFeatures should be passed as an object.');
  }

  // if no world element is passed, use document.body.
  if (!worlds) {
    records[records.length] = new exports.World(document.body);
    worldsCache[worldsCache.length] = records[records.length - 1];
    worldsCacheLookup[worldsCache[worldsCache.length - 1].id] = true;
  // if one world is passed
  } else if (utils.getDataType(worlds) === 'object') {
    records[records.length] = new exports.World(worlds);
    worldsCache[worldsCache.length] = records[records.length - 1];
    worldsCacheLookup[worldsCache[worldsCache.length - 1].id] = true;
  // if an array of worlds is passed
  } else if (utils.getDataType(worlds) === 'array' && worlds.length) {
    for (i = 0, max = worlds.length; i < max; i++) {
      world = worlds[i];
      if (world && utils.getDataType(world) === 'object') {
        records[records.length] = new exports.World(world);
        worldsCache[worldsCache.length] = records[records.length - 1];
        worldsCacheLookup[worldsCache[worldsCache.length - 1].id] = true;
      }
    }
  }

  // run the initial setup function
  if (utils.getDataType(setup) === 'function') {
    setup.call(this);
  }

  // if system is not meant to start immediately, start it.
  if (!noStart) {
    this._update();
  }

  // save the current and last mouse position
  exports.Utils.addEvent(document, 'mousemove', function(e) {
    System._recordMouseLoc.call(System, e);
  });

  // save the current and last touch position
  exports.Utils.addEvent(window, 'touchstart', function(e) {
    System._recordMouseLoc.call(System, e);
  });
  exports.Utils.addEvent(window, 'touchmove', function(e) {
    System._recordMouseLoc.call(System, e);
  });
  exports.Utils.addEvent(window, 'touchend', function(e) {
    System._recordMouseLoc.call(System, e);
  });

   // listen for window resize
  exports.Utils.addEvent(window, 'resize', function(e) {
    System._resize.call(System, e);
  });

  return System.allElements();
};

/**
 * Increments idCount and returns the value. Use when
 * generating a unique id.
 */
System._getNewId = function() {
  this._idCount++;
  return this._idCount;
};

/**
 * Returns the current id count.
 */
System._getIdCount = function() {
  return this._idCount;
};

/**
 * Iterates over _records array and calls step() and draw() to
 * update properties and render their corresponding DOM element.
 */
System._update = function() {

  var i, max, _update, records = this.allElements(), record,
      worlds = this.allWorlds();

  // check for resize stop
  if (this._resizeTime && new Date().getTime() - this._resizeTime > 100) {
    this._resizeTime = 0;
    for (i = 0, max = worlds.length; i < max; i += 1) {
      worlds[i].pauseStep = false;
    }
  }

  for (i = records.length - 1; i >= 0; i -= 1) {
    record = records[i];
    if (record.step && !record.world.pauseStep) {
      record.step();
    }
  }

  for (i = records.length - 1; i >= 0; i -= 1) {
    record = records[i];
    if (record.draw && !record.world.pauseDraw) {
      record.draw();
    }
  }

  _update = (function (me) {
    return (function() {
      me._update(me);
    });
  })(this);
  window.requestAnimFrame(_update);
};

/**
 * Returns a reference to a world.
 *
 * @param {Object} world A DOM element representing a world.
 * @returns {Object} A world.
 */
System.getWorld = function(world) {
  var records = this._records.list;
  for (var i = 0, max = records.length; i < max; i++) {
    if (records[i].el === world) {
      return records[i];
    }
  }
  return null;
};

/**
 * Returns all worlds in the System.
 *
 * @returns {Array} A list of all worlds in the System.
 */
System.allWorlds = function() {
  return this._worldsCache.list;
};

/**
 * Checks if world exists.
 *
 * @param {string} id A world id.
 * @returns {boolen} True if world exists. False if not.
 */
System.hasWorld = function(id) {
  return System._worldsCache.lookup[id];
};

/**
 * Starts the system.
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
  var cache = System._Caches[obj.name] ||
      (System._Caches[obj.name] = {
        lookup: {},
        list: []
      });

  cache.list[cache.list.length] = obj;
  cache.lookup[obj.id] = true;
  return cache;
};

/**
 * Assigns the given 'val' to the given object's record in System._Caches.
 *
 * @param {Object} obj An object.
 * @param {Boolean} val True if object is active, false if object is destroyed.
 */
System._updateCacheLookup = function(obj, val) {

  var cache = System._Caches[obj.name];

  if (cache) {
    cache.lookup[obj.id] = val;
  }
};

/**
 * Adds an object to the system.
 *
 * @param {string} klass The object's class. The system assumes
 *    Burner lives under a top level namespace that holds classes
 *    representing objects that live in the system.
 * @param {Object} opt_options A map of properties used by the
 *    object's constuctor to define the object's attributes.
 * @returns {Object} The last element in the system.
 * @example The following exmaple adds a new Mover with a mass
 *    of 100 to the system.
 *
 * this.add('Mover', {
 *  mass: 100
 * });
 */
System.add = function(klass, opt_options) {

  var options = opt_options || {},
      records = this.allElements(),
      recordsLookup = this._records.lookup,
      parentNode = null, el;

  if (!options.world || exports.Utils.getDataType(options.world) !== 'object') {
    options.world = records[0];
  } else {
    // if a world was passed, find its reference in _records
    el = options.world.el ? options.world.el : options.world;
    options.world = System.getWorld(el);
  }

  // recycle object if one is available
  var pool = this.getAllElementsByName(klass, options.world._pool);
  if (pool.length) {
    for (var i = 0, max = options.world._pool.length; i < max; i++) {
      if (options.world._pool[i].name === klass) {
        // pop off _pool array
        records[records.length] = options.world._pool.splice(i, 1)[0];
        // pass new options
        records[records.length - 1].options = options;
        // update Cache lookup
        System._updateCacheLookup(records[records.length - 1], true);
        break;
      }
    }
  } else {
    /**
     * No pool objects available, create a new one.
     * Add the instance to the records list array.
     * Assumes 'klass' has extended Element.
     * If not, tries calling Element directly.
     */
    if (parent && parent[klass]) {
      records[records.length] = new parent[klass](options);
    } else {
      records[records.length] = new exports[klass](options);
    }
  }
  /**
   * Initialize the new object.
   * If object is static, it should not have
   * an _init() function or a step() function.
   */
  if (records[records.length - 1]._init) {
    records[records.length - 1]._init();
  }
  // add the new object to records lookup table; value = parentNode of its DOM element
  if (records[records.length - 1].el) {
    parentNode = records[records.length - 1].el.parentNode;
  }
  recordsLookup[records[records.length - 1].id] = parentNode;

  return this.lastElement();
};


/**
 * Returns the total number of elements.
 *
 * @returns {number} Total number of elements.
 */
System.count = function() {
  return this._records.list.length;
};

/**
 * Checks if system has an element.
 *
 * @param {string} id An element id.
 * @returns {boolean} True if element exists. False if not.
 */
System.hasElement = function(id) {
  return System._records.lookup[id];
};

/**
 * Returns all elements in the System.
 *
 * @returns {Array} A list of all elements in the System.
 */
System.allElements = function() {
  return this._records.list;
};

/**
 * Returns the first element in the System.
 *
 * @returns {Object} The first element in the System.
 */
System.firstElement = function() {
  return this._records.list[0];
};

/**
 * Returns the last element in the System.
 *
 * @returns {Object} The last element in the System.
 */
System.lastElement = function() {
  return this._records.list[this._records.list.length - 1];
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
 * Returns an array of elements with an attribute that matches the
 * passed 'attr'. If 'opt_val' is passed, 'attr' must equal 'val'.
 *
 * @param {string} attr The property to match.
 * @param {*} [opt_val=] The 'attr' property must equal 'val'.
 * @returns {Array} An array of elements.
 */
System.getAllElementsByAttribute = function(attr, opt_val) {

  var i, max, arr = [], val = opt_val !== undefined ? opt_val : null;

  for (i = 0, max = this._records.list.length; i < max; i++) {
    if (this._records.list[i][attr] !== undefined) {
      if (val !== null && this._records.list[i][attr] !== val) {
        continue;
      }
      arr[arr.length] = this._records.list[i];
    }
  }
  return arr;
};

/**
 * Updates the properties of elements created from the same constructor.
 *
 * @param {string} name The constructor name.
 * @param {Object} props A map of properties to update.
 * @returns {Array} An array of elements.
 * @example
 * System.updateElementPropsByName('point', {
 *    color: [0, 0, 0],
 *    scale: 2
 * }); // all points will turn black and double in size
 */
System.updateElementPropsByName = function(name, props) {

  var i, max, p, arr = this.getAllElementsByName(name);

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
 * Finds an element by its 'id' and returns it.
 *
 * @param {string|number} id The element's id.
 * @returns {Object} The element.
 */
System.getElement = function(id) {

  var i, max, records = this._records;

  for (i = 0, max = records.list.length; i < max; i += 1) {
    if (records.list[i].id === id) {
      return records.list[i];
    }
  }
  return null;
};

/**
 * Updates the properties of an element.
 *
 * @param {Object} element The element.
 * @param {Object} props A map of properties to update.
 * @returns {Object} The element.
 * @example
 * System.updateElement(myElement, {
 *    color: [0, 0, 0],
 *    scale: 2
 * }); // element will turn black and double in size
 */
System.updateElement = function(element, props) {

  for (var p in props) {
    if (props.hasOwnProperty(p)) {
      element[p] = props[p];
    }
  }
  return element;
};

/**
 * Removes an element from a world.
 *
 * @param {Object} obj The element to remove.
 */
System.destroyElement = function (obj) {

  var i, max,
      records = this._records.list;

  for (i = 0, max = records.length; i < max; i += 1) {
    if (records[i].id === obj.id) {
      records[i].el.style.visibility = 'hidden'; // hide element
      records[i].el.style.top = '-5000px';
      records[i].el.style.left = '-5000px';
      records[i].world._pool[records[i].world._pool.length] = records.splice(i, 1)[0]; // move record to pool array
      System._updateCacheLookup(obj, false);
      break;
    }
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
      csstransforms: Modernizr.csstransforms
    };
  } else {
    features = {
      csstransforms3d: exports.FeatureDetector.detect('csstransforms3d'),
      csstransforms: exports.FeatureDetector.detect('csstransforms')
    };
  }
  return features;
};

/**
 * Saves the mouse location relative to the browser window.
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

  return this.mouse;
};

/**
 * Called from a window resize event, resize() repositions all elements relative
 * to the new window size.
 */
System._resize = function() {

  var i, max, loc, records = this.allElements(), record,
      screenDimensions = exports.Utils.getWindowSize(),
      windowWidth = screenDimensions.width,
      windowHeight = screenDimensions.height,
      worlds = this.allWorlds(), world;

  // set _resizeTime; checked in _update for resize stop
  this._resizeTime = new Date().getTime();

  // set pauseStep for all worlds
  for (i = 0, max = worlds.length; i < max; i += 1) {
    worlds[i].pauseStep = true;
  }

  for (i = 0, max = records.length; i < max; i += 1) {

    record = records[i];

    if (record.name !== 'world') {

      loc = record.location;
      world = record.world;

      if (loc) {
        loc.x = windowWidth * (loc.x / world.bounds[1]);
        loc.y = windowHeight * (loc.y / world.bounds[2]);
      }
    }
  }

  // reset the bounds of all worlds
  for (i = 0, max = worlds.length; i < max; i += 1) {
    worlds[i].bounds = worlds[i]._getBounds();
  }
};

/**
 * Pauses updates to a world.
 *
 * @param {Object|Array} [opt_world] A DOM element or array of DOM elements
 *    representing worlds.
 * @private
 */
System._pause = function(opt_world) {

  var i, max, worlds = [];

  // if no world passed, use all worlds
  if (!opt_world) {
    worlds = System.allWorlds();
    // if one world is passed
  } else if (exports.Utils.getDataType(opt_world) === 'object') {
    // if a world was passed, find its reference in _records
    worlds.push(System.getWorld(worlds));
  } else if (exports.Utils.getDataType(opt_world) === 'array') {
    // if an array of worlds was passed
    worlds = opt_world;
  }

  for (i = 0, max = worlds.length; i < max; i++) {
    worlds[i].pauseStep = !worlds[i].pauseStep;
    worlds[i].pauseDraw = !worlds[i].pauseDraw;
  }
};

/**
 * Resets the system.
 * @private
 */
System._resetSystem = function() {
  System._destroySystem(true);
  System._setup.call(System);
};

/**
 * Removes all elements in all worlds.
 *
 * @private
 */
System._destroyAllElements = function() {

  var i, elements = System.allElements();

  for (i = elements.length - 1; i >= 0; i--) {
    if (!System.hasWorld([elements[i].id])) {
      elements.splice(i, 1);
    }
  }
};

/**
 * Resets the system and removes all worlds and elements.
 *
 * @param {boolean} opt_reset Set to true to skip removing worlds.
 * @private
 */
System._destroySystem = function(opt_reset) {

  var i, max, world, worlds = System.allWorlds(),
      elements = System.allElements(), reset = opt_reset || false;

  for (i = 0, max = worlds.length; i < max; i++) {
    // unpause all worlds
    worlds[i].pauseStep = false;
    worlds[i].pauseDraw = false;

    world = worlds[i].el;
    while(world.firstChild) {
      world.removeChild(world.firstChild);
    }
    // if resetting, do not remove worlds
    if (!reset) {
      world.parentNode.removeChild(world);
    }
  }

  // if not resetting, remove all elements and worlds
  if (!reset) {
    System._records = {
      lookup: {},
      list: []
    };

    System._worldsCache = {
      lookup: {},
      list: []
    };

    System._idCount = 0;

  } else { // if resetting, remove all elements except worlds
    System._destroyAllElements();
  }

  System.mouse = {
    location: new exports.Vector(),
    lastLocation: new exports.Vector(),
    velocity: new exports.Vector()
  };

  System._resizeTime = 0;

  if (System._statsDisplay) {
    System._statsDisplay.destroy();
    System._statsDisplay = null;
  }
};

/**
 * Displays frame rate stats.
 *
 * @private
 */
System._stats = function() {
  if (!System._statsDisplay) {
    System._statsDisplay = new exports.StatsDisplay();
  } else {
    System._statsDisplay.destroy();
    System._statsDisplay = null;
  }
};

// pubsub events
exports.PubSub.subscribe('pause', System._pause);
exports.PubSub.subscribe('resetSystem', System._resetSystem);
exports.PubSub.subscribe('destroyAllElements', System._destroyAllElements);
exports.PubSub.subscribe('destroySystem', System._destroySystem);
exports.PubSub.subscribe('stats', System._stats);
exports.PubSub.subscribe('UpdateCache', System.updateCache);

exports.System = System;
