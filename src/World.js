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

  var options = opt_options || {};

  this.width = options.width || this.el.scrollWidth;
  this.height = options.height || this.el.scrollHeight;
  this.gravity = options.gravity || new Vector(0, 1);
  this.c = options.c || 0.1;
  this.pauseStep = !!options.pauseStep;
  this.pauseDraw = !!options.pauseDraw;
};

/**
 * Creates a new World.
 *
 * @param {Object} el The DOM element representing the world.
 * @param {Object} [opt_options=] A map of initial properties.
 * @constructor
 */
/*function _World(el, opt_options) {

  if (!el || typeof el !== 'object') {
    throw new Error('World: A valid DOM object is required for the new World "el" property.');
  }

  var options = opt_options || {},
      viewportSize = exports.System.getWindowSize();

  this.el = el;
  this.name = 'World';
  this.el.className = this.name.toLowerCase();
  this.id = this.name + exports.System.getNewId();
  this.width = options.width || 0;
  this.height = options.height || 0;
  this.autoWidth = !!options.autoWidth;
  this.autoHeight = !!options.autoHeight;
  this.angle = 0;
  this.color = options.color || 'transparent';
  this.colorMode = options.colorMode || 'rgb';
  this.visibility = options.visibility || 'visible';
  this.opacity = options.opacity || 1;
  this.borderWidth = options.borderWidth || 0;
  this.borderStyle = options.borderStyle || 'none';
  this.borderColor = options.borderColor || 'transparent';
  this.boxShadowOffset = options.boxShadowOffset || new exports.Vector();
  this.boxShadowBlur = options.boxShadowBlur || 0;
  this.boxShadowSpread = options.boxShadowSpread || 0;
  this.boxShadowColor = options.boxShadowColor || 'transparent';
  this.gravity = options.gravity || new exports.Vector(0, 1);
  this.c = options.c || 0.1;
  this.boundToWindow = options.boundToWindow === false ? false : true;
  this.location = options.location || new exports.Vector(viewportSize.width / 2, viewportSize.height / 2);
  this.initLocation = new exports.Vector(this.location.x, this.location.y);
  this.position = options.position || 'absolute';
  this.paddingTop = options.paddingTop || 0;
  this.paddingRight = options.paddingRight || 0;
  this.paddingBottom = options.paddingBottom || 0;
  this.paddingLeft = options.paddingLeft || 0;
  this.marginTop = options.marginTop || 0;

  this.pauseStep = false;
  this.pauseDraw = false;

  this._setBounds();

  this._pool = []; // object pool


  this.world = {};

  this.draw();


  this.isStatic = typeof options.isStatic !== 'undefined' ? options.isStatic : true;
  this.drawState = 0;
}*/

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
 * Updates the corresponding DOM element's style property.
 * If world is static, we want to draw with passed properties first,
 * then clear the style, then do nothing. If world is not static, we
 * want to update it every frame.
 */
World.prototype.draw = function() {

  /*if (this.drawState === 2 && this.isStatic) {
    return;
  } else if (!this.drawState || !this.isStatic) {
    exports.System._draw(this);
  } else if (this.drawState === 1) {
    this.el.style.cssText = '';
  }
  this.drawState++;*/
};

module.exports.World = World;