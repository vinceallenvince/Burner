/*global exports, document */

/**
 * Creates a new Item.
 *
 * @param {Object} options Initial properties.
 * @constructor
 */
function Item(options) {

  if (!options || !options.world || typeof options.world !== 'object') {
    throw new Error('Item: A valid DOM object is required for the new Items\'s \"world\" property.');
  }

  this.world = options.world;
  this.name = options.name || 'Item';
  this.id = this.name + exports.System.getNewId();

  this._force = new exports.Vector();
  this._camera = new exports.Vector();

  this.el = document.createElement('div');
  this.el.id = this.id;
  this.el.className = 'item ' + this.name.toLowerCase();
  this.el.style.visibility = 'hidden';
  this.world.el.appendChild(this.el);
}

/**
 * Resets all properties.
 *
 * @param {Object} opt_options= A map of options.
 */
Item.prototype.reset = function(opt_options) {

  var options = opt_options;

  this.width = options.width || 10;
  this.height = options.height || 10;
  this.color = options.color || [0, 0, 0];
  this.colorMode = options.colorMode || 'rgb';
  this.visibility = options.visibility || 'visible';
  this.opacity = options.opacity || 1;
  this.borderWidth = options.borderWidth || 0;
  this.borderStyle = options.borderStyle || 'none';
  this.borderColor = options.borderColor || 'transparent';
  this.borderRadius = options.borderRadius || 0;
  this.boxShadowOffset = options.boxShadowOffset || new exports.Vector();
  this.boxShadowBlur = options.boxShadowBlur || 0;
  this.boxShadowSpread = options.boxShadowSpread || 0;
  this.boxShadowColor = options.boxShadowColor || 'transparent';

  this.bounciness = options.bounciness || 0.8;
  this.mass = options.mass || 10;
  this.acceleration = new exports.Vector();
  this.velocity = new exports.Vector();
  this.location = options.location ||
      new exports.Vector(this.world.width / 2, this.world.height / 2);

  this.lifespan = options.lifespan || -1;
  this.life = options.life || 0;
  this.isStatic = !!options.isStatic;
  this.controlCamera = !!options.controlCamera;
};

/**
 * Updates properties.
 */
Item.prototype.step = function() {
  if (!this.isStatic) {
    this._applyForce(this.world.gravity);
    this.velocity.add(this.acceleration);
    this.location.add(this.velocity);
    if (this.controlCamera) {
    this._checkCameraEdges();
    }
    this._checkWorldEdges();
    this.acceleration.mult(0);
    if (this.life < this.lifespan) {
      this.life++;
    } else if (this.lifespan !== -1) {
      exports.System.destroyItem(this);
    }
  }
};

/**
 * Adds a force to this object's acceleration.
 *
 * @param {Object} force A Vector representing a force to apply.
 * @returns {Object} A Vector representing a new acceleration.
 */
Item.prototype._applyForce = function(force) {
  // calculated via F = m * a
  if (force) {
    this._force.x = force.x;
    this._force.y = force.y;
    this._force.div(this.mass);
    this.acceleration.add(this._force);
    return this.acceleration;
  }
};

/**
 * Determines if this object is outside the world bounds.
 *
 * @returns {boolean} Returns true if the object is outside the world.
 * @private
 */
Item.prototype._checkWorldEdges = function() {

  var worldRight = this.world.bounds[1],
      worldBottom = this.world.bounds[2],
      location = this.location,
      velocity = this.velocity,
      width = this.width,
      height = this.height,
      bounciness = this.bounciness;

  // transform origin is at the center of the object
  if (location.x + width / 2 > worldRight) {
    location.x = worldRight - width / 2;
    velocity.x *= -1 * bounciness;
  } else if (location.x < width / 2) {
    location.x = width / 2;
    velocity.x *= -1 * bounciness;
  }

  if (location.y + height / 2 > worldBottom) {
    location.y = worldBottom - height / 2;
    velocity.y *= -1 * bounciness;
  } else if (location.y < height / 2) {
    location.y = height / 2;
    velocity.y *= -1 * bounciness;
  }
};

/**
 * Moves the world in the opposite direction of the Camera's controlObj.
 */
Item.prototype._checkCameraEdges = function() {
  this._camera.x = this.velocity.x;
  this._camera.y = this.velocity.y;
  this.world.location.add(this._camera.mult(-1));
};

/**
 * Updates the corresponding DOM element's style property.
 */
Item.prototype.draw = function() {

  var cssText = exports.System.getCSSText({
    x: this.location.x - this.width / 2,
    y: this.location.y - this.height / 2,
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

exports.Item = Item;
