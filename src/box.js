/**
 * Creates a new Box.
 *
 * @param {Object} [opt_options=] A map of initial properties.
 * @constructor
 */
function Box(opt_options) {

  var options = opt_options || {};
  options.name = 'Box';
  exports.Item.call(this, options);
}
System.extend(Box, Item);

/**
 * Initializes the ball.
 * @param {Object} options Initial options.
 */
Box.prototype.init = function(options) {
  this.width = options.width || 20;
  this.height = options.height || 20;
  this.color = options.color || [100, 100, 100];
  this.borderRadius = options.borderRadius || 0;
};
