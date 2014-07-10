var test = require('tape'),
    Utils, obj;

test('load Utils.', function(t) {
  Utils = require('../src/Utils').Utils;
  t.ok(Utils, 'object loaded');
  t.end();
});

test('Extends the properties and methods of a superClass onto a subClass.', function(t) {
  function Ball() {
    this.name = 'ball';
  }
  Ball.prototype.hello = function() {
    return 'hi';
  };
  function Box() {
    Ball.call(this);
  }
  Utils.extend(Box, Ball)
  var box = new Box();
  t.equal(box.hello(), 'hi', 'subClass inherits methods of superClass');
  t.equal(box.name, 'ball', 'subClass inherits properties of superClass');
  t.end();
});

test('getRandomNumber() generates a psuedo-random number within a range.', function(t) {
  var num = Utils.getRandomNumber(10, 20);
  t.assert(num >= 10 && num <= 20, 'returned number is within passed range.');
  var num = Utils.getRandomNumber(10, 20, true);
  t.assert(num % 1 !== 0, 'returned number is a float.');
  t.end();
});

test('map() re-maps a number from one range to another.', function(t) {
  var num = Utils.map(5, 0, 10, 0, 100);
  t.assert(num = 50, 'returned number is mapped to range.');
  t.end();
});

test('addEvent() adds an event listener to a DOM element.', function(t) {
  var val;
  var event = document.createEvent('Event');
  event.initEvent('build', true, true);
  Utils.addEvent(document, 'build', function() {val = 100;});
  document.dispatchEvent(event);
  t.equal(val, 100, 'addEventListener handler called when event fires.');


  var eventHello = document.createEvent('Event');
  eventHello.initEvent('hello', true, true);
  var obj = {
    el: document.createElement('div')
  };
  obj.el.addEventListener = null;
  obj.el.attachEvent = function(eventType, handler) {
    obj[eventType] = handler;
    console.log(obj);
  };
  Utils.addEvent(obj.el, 'hello', function() {val = 200;});
  obj.onhello();
  t.equal(val, 200, 'attachEvent handler called when event fires.');

  t.end();
});

test('degreesToRadians() converts degrees to radians.', function(t) {
  var num = parseFloat(Utils.degreesToRadians(45).toPrecision(2));
  t.equal(num, 0.79, 'converts degrees to radians.');
  t.throws(function () {
    Utils.degreesToRadians()
  }, 'should throw exception when not passed radians.');
  t.end();
});

test('radiansToDegrees() converts radians to degrees.', function(t) {
  var num = parseFloat(Utils.radiansToDegrees(0.79).toPrecision(2));
  t.equal(num, 45, 'converts radians to degrees.');
  t.throws(function () {
    Utils.radiansToDegrees()
  }, 'should throw exception when not passed degrees.');
  t.end();
});

test('constrain() constrains a value within a range.', function(t) {
  var num = Utils.constrain(50, 40, 100);
  t.equal(num, 50, 'mid-range.');
  var num = Utils.constrain(30, 40, 100);
  t.equal(num, 40, 'low-range.');
  var num = Utils.constrain(150, 40, 100);
  t.equal(num, 100, 'high-range.');
  t.end();
});

