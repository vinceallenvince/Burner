/*global exports */

/**
 * Creates a new World.
 *
 * @param {Object} el The DOM element representing the world.
 * @param {Object} opt_options= Optional properties.
 * @constructor
 */
function World(el, opt_options) {

  if (!el || typeof el !== 'object') {
    throw new Error('World: A valid DOM object is required for the new World\'s \"el\" property.');
  }

  var options = opt_options || {};

  this.el = el;
  this.name = 'World';
  this.width = 0;
  this.height = 0;
  this.color = options.color || [255, 255, 255];
  this.colorMode = options.color || 'rgb';
  this.visibility = options.visibility || 'visible';
  this.opacity = options.opacity || 1;
  this.borderWidth = options.borderWidth || 0;
  this.borderStyle = options.borderStyle || 'none';
  this.borderColor = options.borderColor || 'transparent';
  this.boxShadowOffset = options.boxShadowOffset || new exports.Vector();
  this.boxShadowBlur = options.boxShadowBlur || 0;
  this.boxShadowSpread = options.boxShadowSpread || 0;
  this.boxShadowColor = options.boxShadowColor || 'transparent';

  this.pauseStep = false;
  this.pauseDraw = false;
  this.gravity = new exports.Vector(0, 1);
  this.location = new exports.Vector();
  this._setBounds();

  this.el.className = 'world';

  // object pool
  this._pool = [];

  /**
   * Worlds do not have worlds. However, assigning an
   * object literal makes for less conditions in the
   * update loop.
   */
  this.world = {};
}

/**
 * A noop.
 */
World.prototype.step = function() {};

/**
 * Updates the corresponding DOM element's style property.
 */
World.prototype.draw = function() {

  var cssText = exports.System.getCSSText({
    x: this.location.x,
    y: this.location.y,
    width: this.width,
    height: this.height,
    color0: this.color[0],
    color1: this.color[1],
    color2: this.color[2],
    colorMode: this.colorMode,
    visibility: this.visibility,
    opacity: this.opacity,
    borderWidth: this.borderWidth,
    borderStyle: this.borderStyle,
    borderColor0: this.borderColor[0],
    borderColor1: this.borderColor[1],
    borderColor2: this.borderColor[2],
    borderRadius: this.borderRadius,
    boxShadowOffsetX: this.boxShadowOffset.x,
    boxShadowOffsetY: this.boxShadowOffset.y,
    boxShadowBlur: this.boxShadowBlur,
    boxShadowSpread: this.boxShadowSpread,
    boxShadowColor0: this.boxShadowColor[0],
    boxShadowColor1: this.boxShadowColor[1],
    boxShadowColor2: this.boxShadowColor[2]
  });
  this.el.style.cssText = cssText;
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

  this.bounds = [0, screenDimensions.width, screenDimensions.height, 0];
  this.width = screenDimensions.width;
  this.height = screenDimensions.height;
};

exports.World = World;
