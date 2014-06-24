/*global window, document, setTimeout, Burner, Modernizr */
/*jshint supernew:true */

var Item = require('./Item').Item,
    World = require('./World').World,
    Vector = require('./Vector').Vector;

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

/** @namespace */
var System = {
  name: 'System'
};

/**
 * Holds additional classes that can be defined at runtime.
 * @memberof System
 */
System.Classes = {
  'Item': Item
};

/**
 * Holds a vector describing the system gravity.
 * @memberof System
 */
System.gravity = new Vector(0, 1);

/**
 * Holds a vector describing the system wind.
 * @memberof System
 */
System.wind = new Vector();

/**
 * Stores references to all items in the system.
 * @memberof System
 * @private
 */
System._records = [];

/**
 * Stores references to all items removed from the system.
 * @memberof System
 * @private
 */
System._pool = [];

 /**
  * Call to execute any setup code before starting the animation loop.
  * @function setup
  * @param  {Object} opt_func   A function to run before the function exits.
  * @param  {Object|Array} opt_worlds A instance or array of instances of World.
  * @memberof System
  */
System.setup = function(opt_func, opt_worlds) {

  var worlds = opt_worlds || new World(document.body),
      func = opt_func || function() {}, i, l, max;

  if (Object.prototype.toString.call(worlds) === '[object Array]') {
    l = worlds.length;
    for (i = 0, max = l; i < max; i++) {
      System._addWorld(worlds[i]);
    }
  } else {
    System._addWorld(worlds);
  }

  l = System._records.length;
  for (i = 0, max = l; i < max; i++) {
    System._records[i].init();
  }

  func.call(this);
};

/**
 * Adds world to System records and worlds cache.
 *
 * @function _addWorld
 * @memberof System
 * @private
 * @param {Object} world An instance of World.
 */
System._addWorld = function(world) {
  System._records.push(world);
};

/**
 * Adds instances of class to _records and calls init on them.
 * @function add
 * @memberof System
 * @param {string} klass The name of the class to add.
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {string=} [opt_world = System._records[0]] An instance of World to contain the item.
 * @returns {Object} An instance of the added item.
 */
System.add = function(klass, opt_options, opt_world) {

  var records = this._records,
      options = opt_options || {},
      world = opt_world || System._records[0];

  // recycle object if one is available
  if (System._pool.length) {
    records[records.length] = System._pool.splice(0, 1)[0];
  } else {
    if (System.Classes[klass]) {
      records.push(new System.Classes[klass]({name: klass}));
    } else {
      records.push(new Item());
    }
  }
  records[records.length - 1].init(world, options);
  return records[records.length - 1];
};

/**
 * Removes an item from the system.
 * @function remove
 * @memberof System
 * @param {Object} obj The item to remove.
 */
System.remove = function (obj) {

  var i, max, records = System._records;

  for (i = 0, max = records.length; i < max; i++) {
    if (records[i].id === obj.id) {
      records[i].el.style.visibility = 'hidden'; // hide item
      System._pool[System._pool.length] = records.splice(i, 1)[0]; // move record to pool array
      break;
    }
  }
};

/**
 * Iterates over records.
 * @function loop
 * @memberof System
 */
System.loop = function() {
  var i, records = System._records,
      len = System._records.length;
  for (i = len - 1; i >= 0; i -= 1) {
    records[i].step();
  }
  len = System._records.length; // check length in case items were removed in step()
  for (i = len - 1; i >= 0; i -= 1) {
    records[i].draw();
  }
  if (typeof window.requestAnimationFrame !== 'undefined') {
    window.requestAnimationFrame(System.loop);
  }
};

module.exports.System = System;
