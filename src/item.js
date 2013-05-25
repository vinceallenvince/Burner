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

  this.maxSpeed = options.maxSpeed === 0 ? 0 : options.maxSpeed || 10;
  this.minSpeed = options.minSpeed || 0;
  this.angle = options.angle || 0;

  this.lifespan = options.lifespan || -1;
  this.life = options.life || 0;
  this.isStatic = !!options.isStatic;
  this.controlCamera = !!options.controlCamera;
  this.checkWorldEdges = options.checkWorldEdges === false ? false : true;
  this.wrapWorldEdges = !!options.wrapWorldEdges;
};

/**
 * Updates properties.
 */
Item.prototype.step = function() {
  if (!this.isStatic) {
    this._applyForce(this.world.gravity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed, this.minSpeed);
    this.location.add(this.velocity);
    if (this.controlCamera) {
      this._checkCameraEdges();
    }
    if (this.checkWorldEdges) {
      this._checkWorldEdges();
    }
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
Item.prototype.applyForce = function(force) {
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
  if (this.wrapWorldEdges) {

    if (location.x - (width / 2) > worldRight) {
      location.x = -width / 2;
    } else if (location.x < -width / 2) {
      location.x = worldRight + (width / 2);
    }

    if (location.y - (height / 2) > worldBottom) {
      location.y = -height / 2;
    } else if (location.y < -height / 2) {
      location.y = worldBottom + (height / 2);
    }
  } else {

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
  exports.System._draw(this);
};

exports.Item = Item;
