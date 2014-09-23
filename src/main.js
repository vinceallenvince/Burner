var System = require('./system');

module.exports = {
  Item: require('./item'),
  System: new System(),
  Utils: require('drawing-utils-lib'),
  Vector: require('vector2d-lib'),
  World: require('./world')
};
