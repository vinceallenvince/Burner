/*global document */

/**
 * Creates a new Item.
 *
 * @param {Object} options A map of initial properties.
 * @constructor
 */
function Item(options) {

  if (!options || !options.world || typeof options.world !== 'object') {
    throw new Error('Item: A valid DOM object is required for the new Item "world" property.');
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
 * @param {Object} [opt_options=] A map of initial properties.
 * @param {number} [opt_options.width = 10] Width.
 * @param {number} [opt_options.height = 10] Height.
 * @param {Array} [opt_options.color = 0, 0, 0] Color.
 * @param {string} [opt_options.colorMode = 'rgb'] Color mode. Accepted values: 'rgb', 'hsl'.
 * @param {string} [opt_options.visibility = 'visible'] Visibility. Accepted values: 'visible', 'hidden'.
 * @param {number} [opt_options.opacity = 1] Opacity.
 * @param {number} [opt_options.zIndex = 1] zIndex.
 * @param {number} [opt_options.borderWidth = 0] borderWidth.
 * @param {string} [opt_options.borderStyle = 'none'] borderStyle.
 * @param {string|Array} [opt_options.borderColor = 'transparent'] borderColor.
 * @param {number} [opt_options.borderRadius = 0] borderRadius.
 * @param {Object} [opt_options.boxShadowOffset = new Vector()] boxShadowOffset.
 * @param {number} [opt_options.boxShadowBlur = 0] boxShadowBlur.
 * @param {number} [opt_options.boxShadowSpread = 0] boxShadowSpread.
 * @param {string|Array} [opt_options.boxShadowColor = 'transparent'] boxShadowColor.
 * @param {number} [opt_options.bounciness = 0.8] bounciness.
 * @param {number} [opt_options.mass = 10] mass.
 * @param {Function|Object} [opt_options.acceleration = new Vector()] acceleration.
 * @param {Function|Object} [opt_options.velocity = new Vector()] velocity.
 * @param {Function|Object} [opt_options.location = new Vector()] location.
 * @param {number} [opt_options.maxSpeed = 10] maxSpeed.
 * @param {number} [opt_options.minSpeed = 10] minSpeed.
 * @param {number} [opt_options.angle = 0] Angle.
 * @param {string} [opt_options.position = 'absolute'] A css position. Possible values: 'absoulte', 'fixed', 'static', 'relative'.
 * @param {number} [opt_options.paddingTop = 0] Padding top.
 * @param {number} [opt_options.paddingRight = 0] Padding right.
 * @param {number} [opt_options.paddingBottom = 0] Padding bottom.
 * @param {number} [opt_options.paddingLeft = 0] Padding left.
 * @param {number} [opt_options.lifespan = -1] Lifespan.
 * @param {number} [opt_options.life = 0] Life.
 * @param {boolean} [opt_options.isStatic = false] If set to true, object will not move.
 * @param {boolean} [opt_options.controlCamera = false] If set to true, object controls the camera.
 * @param {Array} [opt_options.worldBounds = true, true, true, true] Defines the boundaries checked
 *    checkWorldEdges is true.
 * @param {boolean} [opt_options.checkWorldEdges = false] If set to true, system restricts object
 *    movement to world boundaries.
 * @param {boolean} [opt_options.wrapWorldEdges = false] If set to true, system checks if object
 *    intersects world boundaries and resets location to the opposite boundary.
 * @param {boolean} [opt_options.avoidWorldEdges = false] If set to true, object steers away from
 *    world boundaries.
 * @param {number} [opt_options.avoidWorldEdgesStrength = 0] The distance threshold for object
 *    start steering away from world boundaries.
 */
Item.prototype.reset = function(opt_options) {

  var i, options = opt_options || {};

  for (i in options) {
    if (options.hasOwnProperty(i)) {
      this[i] = options[i];
    }
  }

  this.width = typeof options.width === 'undefined' ? 10 : options.width;
  this.height = typeof options.height === 'undefined' ? 10 : options.height;
  this.color = options.color || [0, 0, 0];
  this.colorMode = options.colorMode || 'rgb';
  this.visibility = options.visibility || 'visible';
  this.opacity = typeof options.opacity === 'undefined' ? 1 : options.opacity;
  this.zIndex = typeof options.zIndex === 'undefined' ? 1 : options.zIndex;
  this.borderWidth = options.borderWidth || 0;
  this.borderStyle = options.borderStyle || 'none';
  this.borderColor = options.borderColor || 'transparent';
  this.borderRadius = options.borderRadius || 0;
  this.boxShadowOffset = typeof options.boxShadowOffset === 'undefined' ? new exports.Vector() : options.boxShadowOffset;
  this.boxShadowBlur = options.boxShadowBlur || 0;
  this.boxShadowSpread = options.boxShadowSpread || 0;
  this.boxShadowColor = typeof options.boxShadowColor === 'undefined' ? 'transparent' : options.boxShadowColor;

  this.bounciness = typeof options.bounciness === 'undefined' ? 0.8 : options.bounciness;
  this.mass = typeof options.mass === 'undefined' ? 10 : options.mass;
  this.acceleration = typeof options.acceleration === 'function' ? options.acceleration.call(this) :
      options.acceleration || new exports.Vector();
  this.velocity = typeof options.velocity === 'function' ? options.velocity.call(this) :
      options.velocity || new exports.Vector();
  this.location = typeof options.location === 'function' ? options.location.call(this) :
      options.location || new exports.Vector(this.world.width / 2, this.world.height / 2);
  this.initLocation = new exports.Vector();
  this.initLocation.x = this.location.x;
  this.initLocation.y = this.location.y;

  this.maxSpeed = typeof options.maxSpeed === 'undefined' ? 10 : options.maxSpeed;
  this.minSpeed = options.minSpeed || 0;
  this.angle = options.angle || 0;

  this.position = options.position || 'absolute';
  this.paddingTop = options.paddingTop || 0;
  this.paddingRight = options.paddingRight || 0;
  this.paddingBottom = options.paddingBottom || 0;
  this.paddingLeft = options.paddingLeft || 0;
  this.marginTop = options.marginTop || 0;

  this.lifespan = typeof options.lifespan === 'undefined' ? -1 : options.lifespan;
  this.life = options.life || 0;
  this.isStatic = !!options.isStatic;
  this.controlCamera = !!options.controlCamera;
  this.worldBounds = options.worldBounds || [true, true, true, true];
  this.checkWorldEdges = typeof options.checkWorldEdges === 'undefined' ? true : options.checkWorldEdges;
  this.wrapWorldEdges = !!options.wrapWorldEdges;
  this.wrapWorldEdgesSoft = !!options.wrapWorldEdgesSoft;
  this.avoidWorldEdges = !!options.avoidWorldEdges;
  this.avoidWorldEdgesStrength = typeof options.avoidWorldEdgesStrength === 'undefined' ? 50 : options.avoidWorldEdgesStrength;
};

/**
 * Updates properties.
 */
Item.prototype.step = function() {
  if (!this.isStatic) {
    this.applyForce(this.world.gravity);
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
 * @private
 */
Item.prototype._checkWorldEdges = function() {

  var x, y, worldRight = this.world.bounds[1],
      worldBottom = this.world.bounds[2],
      worldBounds = this.worldBounds,
      location = this.location,
      velocity = this.velocity,
      width = this.width,
      height = this.height,
      bounciness = this.bounciness;

  // transform origin is at the center of the object
  if (this.wrapWorldEdgesSoft) {

    x = location.x;
    y = location.y;

    if (location.x > worldRight) {
      location.x = -(worldRight - location.x);
      if (this.controlCamera) {
        this.world.location.x = this.world.location.x + x - location.x;
      }
    } else if (location.x < 0) {
      location.x = worldRight + location.x;
      if (this.controlCamera) {
        this.world.location.x = this.world.location.x + x - location.x;
      }
    }

    if (location.y > worldBottom) {
      location.y = -(worldBottom - location.y);
      if (this.controlCamera) {
        this.world.location.y = this.world.location.y + y - location.y;
      }
    } else if (location.y < 0) {
      location.y = worldBottom + location.y;
      if (this.controlCamera) {
        this.world.location.y = this.world.location.y + y - location.y;
      }
    }
  } else if (this.wrapWorldEdges) {

    x = location.x;
    y = location.y;

    if (location.x > worldRight) {
      location.x = 0;
      if (this.controlCamera) {
        this.world.location.x = this.world.location.x + x - location.x;
      }
    } else if (location.x < 0) {
      location.x = worldRight;
      if (this.controlCamera) {
        this.world.location.x = this.world.location.x + x - location.x;
      }
    }

    if (location.y > worldBottom) {
      location.y = 0;
      if (this.controlCamera) {
        this.world.location.y = this.world.location.y + y - location.y;
      }
    } else if (location.y < 0) {
      location.y = worldBottom;
      if (this.controlCamera) {
        this.world.location.y = this.world.location.y + y - location.y;
      }
    }
  } else {

    if (location.x + width / 2 > worldRight && worldBounds[1]) {
      location.x = worldRight - width / 2;
      velocity.x *= -1 * bounciness;
    } else if (location.x < width / 2 && worldBounds[3]) {
      location.x = width / 2;
      velocity.x *= -1 * bounciness;
    }

    if (location.y + height / 2 > worldBottom && worldBounds[2]) {
      location.y = worldBottom - height / 2;
      velocity.y *= -1 * bounciness;
    } else if (location.y < height / 2 && worldBounds[0]) {
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
