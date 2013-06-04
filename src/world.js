/*global exports */

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
  this.id = this.name + exports.System.getNewId();
  this.width = options.width || 0;
  this.height = options.height || 0;
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

  this.pauseStep = false;
  this.pauseDraw = false;

  this._setBounds();

  this._pool = []; // object pool

  /**
   * Worlds do not have worlds. However, assigning an
   * object literal makes for less conditions in the
   * update loop.
   */
  this.world = {};

  this.draw();
}

/**
 * A noop.
 */
World.prototype.step = function() {};

/**
 * Updates the corresponding DOM element's style property.
 */
World.prototype.draw = function() {
  exports.System._draw(this);
};

/**
 * Sets the bounds of the world's visible area.
 *
 * returns {Array} An array representing the bounds
 *    of the page's visible area in box-model format.
 * @private
 */
World.prototype._setBounds = function() {

  var screenDimensions = exports.System.getWindowSize();

  if (this.boundToWindow) {
    this.bounds = [0, screenDimensions.width, screenDimensions.height, 0];
    this.width = screenDimensions.width;
    this.height = screenDimensions.height;
  } else {
    this.bounds = [0, this.width, this.height, 0];
  }

  this.location = new exports.Vector((screenDimensions.width / 2),
      (screenDimensions.height / 2));
};

exports.World = World;
