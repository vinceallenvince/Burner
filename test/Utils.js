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