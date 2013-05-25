/*global exports */

/**
 * Creates a new Box.
 *
 * @param {Object} opt_options= Initial properties.
 * @constructor
 */
function Box(opt_options) {

  var options = opt_options || {};
  options.name = 'Box';
  exports.Item.call(this, options);
}
exports.System.extend(Box, exports.Item);

Box.prototype.init = function(options) {
  this.width = options.width || 20;
  this.height = options.height || 20;
  this.color = options.color || [100, 100, 100];
  this.borderRadius = options.borderRadius || 0;
};

exports.Box = Box;
