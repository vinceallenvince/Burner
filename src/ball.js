/*global exports */

/**
 * Creates a new Ball.
 *
 * @param {Object} opt_options= Initial properties.
 * @constructor
 */
function Ball(opt_options) {

  var options = opt_options || {};
  options.name = 'Ball';
  exports.Item.call(this, options);
}
exports.System.extend(Ball, exports.Item);

Ball.prototype.init = function(options) {
  this.width = options.width || 20;
  this.height = options.height || 20;
  this.color = options.color || [0, 0, 0];
  this.colorMode = options.colorMode || 'rgb';
  this.borderRadius = options.borderRadius || 100;
  this.opacity = options.opacity || 1;
  this.boxShadowOffset = options.boxShadowOffset || new exports.Vector();
  this.boxShadowBlur = options.boxShadowBlur || 0;
  this.boxShadowSpread = options.boxShadowSpread || 0;
  this.boxShadowColor = options.boxShadowColor || [0, 0, 0];
};

exports.Ball = Ball;
