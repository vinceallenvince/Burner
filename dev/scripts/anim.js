/*global Burner
 */
/*jshint supernew:true */

var Anim = {};

(function(exports) {

  'use strict';

  // create Burner namespace
  exports.Burner = {};

  // pass in the namespace and parent object
  new Burner(exports.Burner, exports);

  function Mover(opt_options) {

    var myDiv, options, utils = exports.Burner.Utils;

    exports.Burner.Element.call(this, opt_options);

    options = opt_options || {};

    this.options = options;
    this.world = options.world;
    this.width = options.width || 10;
    this.height = options.height || 10;
    this.mass = options.mass || 10;
    this.visibility = options.visibility || 'visible';
    this.acceleration = utils.getDataType(options.acceleration) === 'function' ?
        options.acceleration() : options.acceleration || new exports.Vector();
    this.velocity = utils.getDataType(options.velocity) === 'function' ?
        options.velocity() : options.velocity || new exports.Vector();
    this.location = utils.getDataType(options.location) === 'function' ?
        options.location() : options.location || new exports.Vector();

    this._forceVector = new exports.Vector();

    myDiv = document.createElement("div");
    myDiv.id = this.id;
    myDiv.className = 'element';
    myDiv.style.visibility = 'hidden';
    this._el = this.options.world.el.appendChild(myDiv);

    return this;
  }
  exports.Burner.Utils.extend(Mover, exports.Burner.Element);

  /**
   * Calculates location via sum of acceleration + velocity.
   */
  Mover.prototype.step = function() {

    var friction;

    if (this.world.c) { // friction
      friction = exports.Burner.Utils.clone(this.velocity);
      friction.mult(-1);
      friction.normalize();
      friction.mult(this.world.c);
      this._applyForce(friction);
    }
    this._applyForce(this.world.gravity); // gravity
    this.velocity.add(this.acceleration); // add acceleration
    this.location.add(this.velocity); // add velocity
    this._checkEdges();
    this.acceleration.mult(0);
  };

  /**
   * Adds a force to acceleration. Calculated via F = m * a;
   */
  Mover.prototype._applyForce = function(force) {
    if (force) {
      this._forceVector.x = force.x;
      this._forceVector.y = force.y;
      this._forceVector.div(this.mass);
      this.acceleration.add(this._forceVector);
    }
  };

  /**
   * Checks if location violates world boundaries.
   */
  Mover.prototype._checkEdges = function() {
    if (this.location.y + this.height / 2 > this.world.bounds[2]) {
      this.velocity.mult(-0.9);
      this.location.y = this.world.bounds[2] - this.height / 2;
    }
  };

  exports.Mover = Mover;

/**
 * Creates a new Vector.
 *
 * @param {number} [opt_x = 0] The x location.
 * @param {number} [opt_y = 0] The y location.
 * @constructor
 */
function Vector(opt_x, opt_y) {
  var x = opt_x || 0,
      y = opt_y || 0;
  this.x = x;
  this.y = y;
}

/**
 * Subtract two vectors.
 *
 * @param {number} v1 The first vector.
 * @param {number} v2 The second vector.
 * @returns {Object} A new Vector.
 */
Vector.VectorSub = function(v1, v2) {
  return new Vector(v1.x - v2.x, v1.y - v2.y);
};

/**
 * Add two vectors.
 *
 * @param {number} v1 The first vector.
 * @param {number} v2 The second vector.
 * @returns {Object} A new Vector.
 */
Vector.VectorAdd = function(v1, v2) {
  return new Vector(v1.x + v2.x, v1.y + v2.y);
};

/**
 * Multiply a vector by a scalar value.
 *
 * @param {number} v A vector.
 * @param {number} n Vector will be multiplied by this number.
 * @returns {Object} A new Vector.
 */
Vector.VectorMult = function(v, n) {
  return new Vector(v.x * n, v.y * n);
};

/**
 * Divide two vectors.
 *
 * @param {number} v A vector.
 * @param {number} n Vector will be divided by this number.
 * @returns {Object} A new Vector.
 */
Vector.VectorDiv = function(v, n) {
  return new Vector(v.x / n, v.y / n);
};

/**
 * Calculates the distance between two vectors.
 *
 * @param {number} v1 The first vector.
 * @param {number} v2 The second vector.
 * @returns {number} The distance between the two vectors.
 */
Vector.VectorDistance = function(v1, v2) {
  return Math.sqrt(Math.pow(v2.x - v1.x, 2) + Math.pow(v2.y - v1.y, 2));
};

/**
 * Get the midpoint between two vectors.
 *
 * @param {number} v1 The first vector.
 * @param {number} v2 The second vector.
 * @returns {Object} A new Vector.
 */
Vector.VectorMidPoint = function(v1, v2) {
  return Vector.VectorAdd(v1, v2).div(2); // midpoint = (v1 + v2)/2
};

/**
 * Get the angle between two vectors.
 *
 * @param {number} v1 The first vector.
 * @param {number} v2 The second vector.
 * @returns {number} An angle.
 */
Vector.VectorAngleBetween = function(v1, v2) {
  var dot = v1.dot(v2),
  theta = Math.acos(dot / (v1.mag() * v2.mag()));
  return theta;
};

Vector.prototype.name = 'Vector';

/**
* Returns an new vector with all properties and methods of the
* old vector copied to the new vector's prototype.
*
* @returns {Object} A vector.
*/
Vector.prototype.clone = function() {
  function F() {}
  F.prototype = this;
  return new F;
};

/**
 * Adds a vector to this vector.
 *
 * @param {Object} vector The vector to add.
 * @returns {Object} This vector.
 */
Vector.prototype.add = function(vector) {
  this.x += vector.x;
  this.y += vector.y;
  return this;
};

/**
 * Subtracts a vector from this vector.
 *
 * @param {Object} vector The vector to subtract.
 * @returns {Object} This vector.
 */
Vector.prototype.sub = function(vector) {
  this.x -= vector.x;
  this.y -= vector.y;
  return this;
};

/**
 * Multiplies this vector by a passed value.
 *
 * @param {number} n Vector will be multiplied by this number.
 * @returns {Object} This vector.
 */
Vector.prototype.mult = function(n) {
  this.x *= n;
  this.y *= n;
  return this;
};

/**
 * Divides this vector by a passed value.
 *
 * @param {number} n Vector will be divided by this number.
 * @returns {Object} This vector.
 */
Vector.prototype.div = function(n) {
  this.x /= n;
  this.y /= n;
  return this;
};

/**
 * Calculates the magnitude of this vector.
 *
 * @returns {number} The vector's magnitude.
 */
Vector.prototype.mag = function() {
  return Math.sqrt((this.x * this.x) + (this.y * this.y));
};

/**
 * Limits the vector's magnitude.
 *
 * @param {number} high The upper bound of the vector's magnitude.
 * @returns {Object} This vector.
 */
Vector.prototype.limit = function(high) {
  if (this.mag() > high) {
    this.normalize();
    this.mult(high);
  }
  return this;
};

/**
 * Divides a vector by its magnitude to reduce its magnitude to 1.
 * Typically used to retrieve the direction of the vector for later manipulation.
 *
 * @returns {Object} This vector.
 */
Vector.prototype.normalize = function() {
  var m = this.mag();
  if (m !== 0) {
    return this.div(m);
  }
};

/**
 * Calculates the distance between this vector and a passed vector.
 *
 * @param {Object} vector The target vector.
 * @returns {Object} The distance between the two vectors.
 */
Vector.prototype.distance = function(vector) {
  return Math.sqrt(Math.pow(vector.x - this.x, 2) + Math.pow(vector.y - this.y, 2));
};

/**
 * Rotates a vector using a passed angle in radians.
 *
 * @param {number} radians The angle to rotate in radians.
 * @returns {Object} This vector.
 */
Vector.prototype.rotate = function(radians) {
  var cos = Math.cos(radians),
    sin = Math.sin(radians),
    x = this.x,
    y = this.y;

  this.x = x * cos - y * sin;
  this.y = x * sin + y * cos;
  return this;
};

/**
 * Calculates the midpoint between this vector and a passed vector.
 *
 * @param {Object} v1 The first vector.
 * @param {Object} v1 The second vector.
 * @returns {Object} A vector representing the midpoint between the passed vectors.
 */
Vector.prototype.midpoint = function(vector) {
  return Vector.VectorAdd(this, vector).div(2);
};

/**
 * Calulates the dot product.
 *
 * @param {Object} vector The target vector.
 * @returns {Object} A vector.
 */
Vector.prototype.dot = function(vector) {
  if (this.z && vector.z) {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z;
  }
  return this.x * vector.x + this.y * vector.y;
};
exports.Vector = Vector;


}(Anim));