var Vector = require('./Vector').Vector,
    Item = require('./Item').Item,
    Utils = require('./Utils').Utils;

/**
 * Creates a new World.
 *
 * @param {Object} el The DOM element representing the world.
 * @param {Object} [opt_options=] A map of initial properties.
 * @constructor
 */
function World(el, opt_options) {

  if (!el || typeof el !== 'object') {
    throw new Error('World: A valid DOM object is required for the new World "el" property.');
  }

  var options = opt_options || {};

  this.el = el;
  this.name = 'World';
  /**
   * Worlds do not have worlds. However, assigning an
   * object literal makes for less conditions in the
   * update loop.
   */
  this.world = {};
  Item.call(this);
}
Utils.extend(World, Item);

/**
 * Resets all properties.
 * @function init
 * @memberof Item
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {number} [opt_options.width = this.el.scrollWidth] Width.
 * @param {number} [opt_options.height = this.el.scrollHeight] Height.
 *
 */
World.prototype.init = function(opt_options) {

  this._superClass.init.call(this, this.world, opt_options);

  var options = opt_options || {};

  this.width = options.width || this.el.scrollWidth;
  this.height = options.height || this.el.scrollHeight;
  this.location = options.location || new Vector(document.body.scrollWidth / 2, document.body.scrollHeight / 2);
  this.gravity = options.gravity || new Vector(0, 1);
  this.c = options.c || 0.1;
  this.pauseStep = !!options.pauseStep;
  this.pauseDraw = !!options.pauseDraw;
  this.el.className = this.name.toLowerCase();
};

/**
 * Adds an item to the world's view.
 * @param {Object} item An instance of item.
 */
World.prototype.add = function(item) {
  this.el.appendChild(item);
};

/**
 * A noop.
 */
World.prototype.step = function() {};

/**
 * A noop.
 */
World.prototype.draw = function() {};

module.exports.World = World;