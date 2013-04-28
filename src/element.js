/*global exports */
/**
 * Creates a new Element.
 * @constructor
 */
function Element(opt_options) {

  this.options = opt_options || {};
  this.name = this.options.name || 'Element';
  this.id = this.name + exports.System._getNewId();

  return this;
}

/**
 * Sets element's properties via initial options.
 * @private
 */
Element.prototype._init = function() {

  var i, options = this.options;

  if (!options.world || exports.Utils.getDataType(options.world) !== 'object') {
    throw new Error('Element: A valid world object is required for a new Element.');
  }

  // re-assign all options
  for (i in options) {
    if (options.hasOwnProperty(i)) {
      if (exports.Utils.getDataType(options[i]) === 'function') {
        this[i] = options[i]();
      } else {
        this[i] = options[i];
      }
    }
  }

  this._el.style.top = 0;
  this._el.style.left = 0;
};

/**
 * Updates the corresponding DOM elements style property.
 */
Element.prototype.draw = function() {

  var cssText, el = this._el;

  if (el) {
    cssText = this._getCSSText({
      x: this.location.x - this.width / 2,
      y: this.location.y - this.height / 2,
      width: this.width,
      height: this.height,
      color: this.color,
      visibility: this.visibility
    });
    el.style.cssText = cssText;
  }
  return cssText;
};

/**
 * Concatenates a new cssText strings.
 */
Element.prototype._getCSSText = function(props) {

  var position, system = exports.System;

  if (system.supportedFeatures.csstransforms3d) {
    position = [
      '-webkit-transform: translate3d(' + props.x + 'px, ' + props.y + 'px, 0)',
      '-moz-transform: translate3d(' + props.x + 'px, ' + props.y + 'px, 0)',
      '-o-transform: translate3d(' + props.x + 'px, ' + props.y + 'px, 0)',
      '-ms-transform: translate3d(' + props.x + 'px, ' + props.y + 'px, 0)'
    ].join(';');
  } else if (system.supportedFeatures.csstransforms) {
    position = [
      '-webkit-transform: translateX(' + props.x + 'px) translateY(' + props.y + 'px)',
      '-moz-transform: translateX(' + props.x + 'px) translateY(' + props.y + 'px)',
      '-o-transform: translateX(' + props.x + 'px) translateY(' + props.y + 'px)',
      '-ms-transform: translateX(' + props.x + 'px) translateY(' + props.y + 'px)'
    ].join(';');
  } else {
    position = [
      'position: absolute',
      'left: ' + props.x + 'px',
      'top: ' + props.y + 'px'
    ].join(';');
  }

  if (exports.Utils.getDataType(props.color) === 'array') {
    props.background = 'rgb(' + props.color[0] + ', ' + props.color[1] + ', ' + props.color[2] + ')';
  } else {
    props.background = 'transparent';
  }

  return [
    position,
    'width: ' + props.width + 'px',
    'height: ' + props.height + 'px',
    'background-color: ' + props.background,
    'visibility: ' + props.visibility
  ].join(';');
};

exports.Element = Element;
