/*global exports, window, document */
/*jshint supernew:true */
/**
 * @namespace
 */
var Utils = {};

/**
 * Add an event listener to a DOM element.
 *
 * @param {Object} target The element to receive the event listener.
 * @param {string} eventType The event type.
 * @param {function} The function to run when the event is triggered.
 */
Utils.addEvent = function(target, eventType, handler) {

  if (target.addEventListener) { // W3C
    this.addEventHandler = function(target, eventType, handler) {
      target.addEventListener(eventType, handler, false);
    };
  } else if (target.attachEvent) { // IE
    this.addEventHandler = function(target, eventType, handler) {
      target.attachEvent("on" + eventType, handler);
    };
  }
  this.addEventHandler(target, eventType, handler);
};

/**
 * Generates a psuedo-random number within a range.
 *
 * @param {number} low The low end of the range.
 * @param {number} high The high end of the range.
 * @param {boolean} [flt] Set to true to return a float.
 * @returns {number} A number.
 */
Utils.getRandomNumber = function(low, high, flt) {
  if (flt) {
    return Math.random()*(high-(low-1)) + low;
  }
  return Math.floor(Math.random()*(high-(low-1))) + low;
};

/**
 * @returns {Object} The current window width and height.
 * @example getWindowDim() returns {width: 1024, height: 768}
 */
Utils.getWindowSize = function() {

  var d = {
    'width' : false,
    'height' : false
  };
  if (typeof(window.innerWidth) !== "undefined") {
    d.width = window.innerWidth;
  } else if (typeof(document.documentElement) !== "undefined" &&
      typeof(document.documentElement.clientWidth) !== "undefined") {
    d.width = document.documentElement.clientWidth;
  } else if (typeof(document.body) !== "undefined") {
    d.width = document.body.clientWidth;
  }
  if (typeof(window.innerHeight) !== "undefined") {
    d.height = window.innerHeight;
  } else if (typeof(document.documentElement) !== "undefined" &&
      typeof(document.documentElement.clientHeight) !== "undefined") {
    d.height = document.documentElement.clientHeight;
  } else if (typeof(document.body) !== "undefined") {
    d.height = document.body.clientHeight;
  }
  return d;
};

/**
 * Returns a new object with all properties and methods of the
 * old object copied to the new object's prototype.
 *
 * @param {Object} object The object to clone.
 * @returns {Object} An object.
 */
Utils.clone = function(object) {

  function Object() {}
  Object.prototype = object;
  return new Object;
};

/**
 * Use to extend the properties and methods of a superClass
 * onto a subClass.
 */
Utils.extend = function(subClass, superClass) {

  function F() {}
  F.prototype = superClass.prototype;
  subClass.prototype = new F;
  subClass.prototype.constructor = subClass;
};

/**
 * Returns the data type of the passed argument.
 *
 * @param {*} element The variable to test.
*/
Utils.getDataType = function(element) {

  if (Object.prototype.toString.call(element) === '[object Array]') {
    return 'array';
  }

  if (Object.prototype.toString.call(element) === '[object NodeList]') {
    return 'nodeList';
  }

  return typeof element;
};

exports.Utils = Utils;
