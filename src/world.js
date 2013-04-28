/*global exports, document, System */
/**
 * Creates a new World.
 *
 * @param {Object} el The DOM element representing the world.
 * @constructor
 */
function World(el) {

  if (!el || exports.Utils.getDataType(el) !== 'object') {
    throw new Error('World: A valid DOM object is required for the new World\'s \"el\" property.');
  }

  this.el = el;
  this.name = 'world';
  this.id = this.name + exports.System._getNewId();
  this.bounds = this._getBounds();
  this.pauseStep = false;
  this.pauseDraw = false;
  this.style = {};
  this.gravity = new exports.Vector(0, 1);
  this.c = 0.1;
  this.position = 'absolute';
  this.top = 0;
  this.left = 0;
  this.location = new exports.Vector();
  this.opacity = 1;
  this.visibility = 'visible';
  this.angle = 0;
  this.scale = 1;
  this.color = 'transparent';
  this.borderColor = 'transparent';
  this.borderStyle = 'none';
  this.borderWidth = '1';

  /**
   * Worlds do not have worlds. However, assigning an
   * object literal makes for less conditions in the
   * update loop.
   */
  this.world = {};

  /**
   * Worlds have their own object pool bc object's
   * reference child elements of the world.
   */
  this._pool = [];

  /**
   * Force relative positioning on worlds so child
   * positioning is relative to the world.
   */
  //this.el.style.position = 'relative';
}

/**
 * Calculates location.
 *
 * @returns {number} The total number of times step has been executed.
 */
World.prototype.step = function() {

};

/**
 * Updates the corresponding DOM element's style property.
 *
 * @returns {string} A string representing the corresponding DOM element's cssText.
 */
World.prototype.draw = function() {

  var cssText, el = this.el;

  if (el) {
    cssText = this._getCSSText({
      x: this.location.x, // world position is relative to top left
      y: this.location.y,
      width: this.bounds[1],
      height: this.bounds[2],
      opacity: this.opacity,
      visibility: this.visibility,
      a: this.angle,
      s: this.scale,
      color: this.color,
      borderColor: this.borderColor,
      borderStyle: this.borderStyle,
      borderWidth: this.borderWidth
    });
    el.style.cssText = cssText;
  }
  return cssText;
};

/**
 * Concatenates a new cssText string based on passed properties.
 *
 * @param {Object} props A map of properties.
 * @returns {string} A string representing the corresponding DOM element's cssText.
 */
World.prototype._getCSSText = function(props) {

  var color, borderColor, position, system = exports.System, utils = exports.Utils;

  if (system.supportedFeatures.csstransforms3d) {
    position = [
      '-webkit-transform: translate3d(' + props.x + 'px, ' + props.y + 'px, 0) rotate(' + props.a + 'deg) scaleX(' + props.s + ') scaleY(' + props.s + ')',
      '-moz-transform: translate3d(' + props.x + 'px, ' + props.y + 'px, 0) rotate(' + props.a + 'deg) scaleX(' + props.s + ') scaleY(' + props.s + ')',
      '-o-transform: translate3d(' + props.x + 'px, ' + props.y + 'px, 0) rotate(' + props.a + 'deg) scaleX(' + props.s + ') scaleY(' + props.s + ')',
      '-ms-transform: translate3d(' + props.x + 'px, ' + props.y + 'px, 0) rotate(' + props.a + 'deg) scaleX(' + props.s + ') scaleY(' + props.s + ')'
    ].join(';');
  } else if (system.supportedFeatures.csstransforms) {
    position = [
      '-webkit-transform: translateX(' + props.x + 'px) translateY(' + props.y + 'px) rotate(' + props.a + 'deg) scaleX(' + props.s + ') scaleY(' + props.s + ')',
      '-moz-transform: translateX(' + props.x + 'px) translateY(' + props.y + 'px) rotate(' + props.a + 'deg) scaleX(' + props.s + ') scaleY(' + props.s + ')',
      '-o-transform: translateX(' + props.x + 'px) translateY(' + props.y + 'px) rotate(' + props.a + 'deg) scaleX(' + props.s + ') scaleY(' + props.s + ')',
      '-ms-transform: translateX(' + props.x + 'px) translateY(' + props.y + 'px) rotate(' + props.a + 'deg) scaleX(' + props.s + ') scaleY(' + props.s + ')'
    ].join(';');
  } else {
    position = [
      'position: absolute',
      'left: ' + props.x + 'px',
      'top: ' + props.y + 'px'
    ].join(';');
  }

  color = 'rgb(' + props.color[0] + ', ' + props.color[1] + ', ' + props.color[2] + ')';

  borderColor = utils.getDataType(props.borderColor) === 'array' ?
      'rgb(' + props.borderColor[0] + ', ' + props.borderColor[1] + ', ' + props.borderColor[2] + ')' : props.borderColor;

  return [
    position,
    'width: ' + props.width + 'px',
    'height: ' + props.height + 'px',
    'opacity: ' + props.opacity,
    'visibility: ' + props.visibility,
    'background-color: ' + color,
    'border-color: ' + borderColor,
    'border-style: ' + props.borderStyle,
    'border-width: ' + props.borderWidth + 'px'
  ].join(';');
};


/**
 * Updates a world instance with passed arguments. Use to add
 * gravity or other property.
 *
 * @param {Object} opt_props A hash of properties to update.
 * @param {Object|Array} opt_worlds A single reference of an array of
 *    references to DOM elements representing as System worlds.
 * @param {boolean} opt_center Set to true to center the world.
 * @public
 */
World.update = function(opt_props, opt_worlds, opt_center) {

  var i, max, key, el, utils = exports.Utils,
      worlds = opt_worlds, collection = [],
      props = utils.getDataType(opt_props) === 'object' ? opt_props : {},
      screenDimensions = exports.Utils.getWindowSize();

  // if no world element is passed, use document.body.
  if (!worlds) {
    collection[collection.length] = exports.System._records.list[0];
  // if one world is passed
  } else if (utils.getDataType(worlds) === 'object') {
    collection[collection.length] = System.getWorld(worlds);
  // if an array of worlds is passed
  } else if (utils.getDataType(worlds) === 'array' && worlds.length) {
    for (i = 0, max = worlds.length; i < max; i++) {
      el = worlds[i];
      if (utils.getDataType(el) === 'object') {
        collection[collection.length] = System.getWorld(el);
      }
    }
  }

  // loop thru collection of worlds and update properties
  for (i = 0, max = collection.length; i < max; i++) {
    for (key in props) {
      if (props.hasOwnProperty(key)) {
        collection[i][key] = props[key];
      }
    }
    // apply any styles updates
    collection[i]._applyStyles();
    // get bounds again in case style updates had an effect
    collection[i].bounds = collection[i]._getBounds();
    // center the world
    if (opt_center) {
      collection[i].location = new exports.Vector((screenDimensions.width / 2) - (collection[i].bounds[1] / 2),
          (screenDimensions.height / 2) - (collection[i].bounds[2] / 2));
    }

  }

};

/**
 * Loops thru the world's style property and sets
 * styles on its associated DOM element.
 * @private
 */
World.prototype._applyStyles = function() {
  for (var i in this.style) {
    if (this.style.hasOwnProperty(i)) {
      this.el.style[i] = this.style[i];
    }
  }
};

/**
 * Sets the bounds of the page's visible area.
 *
 * returns {Array} An array representing the bounds
 *    of the page's visible area in box-model format.
 * @private
 */
World.prototype._getBounds = function() {

  var screenDimensions;

  if (this.width && this.height) {
    return [0, this.width, this.height, 0];
  }

  if (this.el === document.body) {
     screenDimensions = exports.Utils.getWindowSize();
  } else {
    screenDimensions = {
      width: this.el.offsetWidth,
      height: this.el.offsetHeight
    };
  }
  return [0, screenDimensions.width, screenDimensions.height, 0];
};

exports.World = World;
