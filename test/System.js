var test = require('tape'),
    Item = require('../src/Item').Item,
    Utils = require('../src/Utils').Utils,
    Vector = require('../src/Vector').Vector,
    System, obj;

test('load System.', function(t) {
  System = require('../src/System').System;
  t.ok(System, 'object loaded');
  t.end();
});

test('check static properties.', function(t) {
  t.equal(typeof System.Classes, 'object', 'has a Classes object.');
  t.equal(System.gravity.x, 0, 'has a gravity Vector; default x = 0.');
  t.equal(System.gravity.y, 1, 'has a gravity Vector; default y = 1.');
  t.equal(System.wind.x, 0, 'has a wind Vector; default x = 0.');
  t.equal(System.wind.y, 0, 'has a wind Vector; default y = 0.');
  t.assert(typeof System._records === 'object' && System._records.length === 0, 'has an empty _records array.');
  t.assert(typeof System._pool === 'object' && System._pool.length === 0, 'has an empty _pool array.');
  t.end();
});

test('setup() should execute a callback.', function(t) {
  var val;
  System.setup(function() {val = this._records.length;});
  t.equal(val, 0);
  t.end();
});

test('add() should add create a new item and add it to _records.', function(t) {
  var itemA = System.add();
  t.assert(typeof itemA === 'object' && itemA.name === 'Item', 'add() should return the new item.');
  t.equal(System._records.length, 1, 'should add a new item to _records.');
  function Box() {}
  Box.prototype.init = function() {};
  System.Classes.Box = Box;
  var box = System.add('Box');
  t.equal(typeof box, 'object', 'should return a reference to the added instance.');
  t.equal(System._records.length, 2, 'should add an instance of a custom class to _records');
  t.end();
});

test('add() should pull from pull from System._pool if pooled items exist.', function(t) {
  document.body.innerHTML = '';
  System._records = [];
  System._pool = [];
  System.Classes = {};
  var itemA = System.add();
  t.equal(System._records.length, 1, 'should add a new item to _records');
  System.remove(itemA);
  t.assert(System._records.length === 0 && System._pool.length === 1, 'remove() should remove item from _records and add to _pool.');
  var itemB = System.add();
  t.assert(System._records.length === 1 && System._pool.length === 0, 'add() should check to splice items off _pool.');
  t.end();
});

test('remove() should hide an item and add it to _loop.', function(t) {
  document.body.innerHTML = '';
  System._records = [];
  System._pool = [];
  System.Classes = {};
  System.add();
  t.equal(document.querySelectorAll('.item').length, 1, 'should append a DOM element to the document.body');
  System.remove(System._records[System._records.length - 1]);
  t.equal(System._records.length, 0, 'should remove instance from _records');
  t.equal(System._pool.length, 1, 'shoud add instance to _pool');
  t.end();
});

test('loop() should call step() and draw().', function(t) {
  System._records = [];
  System.gravity.y = 1;
  System.add('Item', {
    location: new Vector(100, 100)
  });
  System._records[System._records.length - 1].init({
    location: new Vector(100, 100)
  });
  System.loop();
  t.equal(System._records[System._records.length - 1].location.y, 100.1, 'step() should update location.');
  t.equal(System._records[System._records.length - 1].acceleration.y, 0, 'step() should reset acceleration.');
  t.end();
});
