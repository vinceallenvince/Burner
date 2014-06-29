var test = require('tape'),
    Item = require('../src/Item').Item,
    Utils = require('../src/Utils').Utils,
    Vector = require('../src/Vector').Vector,
    World = require('../src/World').World,
    StatsDisplay = require('../src/StatsDisplay').StatsDisplay,
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
  t.assert(typeof System.mouse === 'object', 'has an object to store mouse information.');
  t.ok(System.mouse.location instanceof Vector, 'has a mouse location Vector.');
  t.ok(System.mouse.lastLocation instanceof Vector, 'has a mouse lastLocation Vector.');
  t.ok(System.mouse.velocity instanceof Vector, 'has a mouse velocity Vector.');
  t.end();
});

test('setup() should execute a callback.', function(t) {
  var val;
  document.body.innerHTML = '';
  System._records = [];
  System._pool = [];
  System.setup(function() {val = this._records.length;});
  t.equal(val, 1, 'System._records should have at least 1 record when the function exits.');
  var worlds = [];
  worlds.push(new World(document.body));
  worlds.push(new World(document.body));
  document.body.innerHTML = '';
  System._records = [];
  System._pool = [];
  System.setup(function() {val = this._records.length;}, worlds);
  t.equal(val, 2, 'System._records should have at least 2 records when the function exits.');
  t.equal(typeof System.setupFunc, 'function', 'should save the setup callback in case we need to reset the system.');
  t.end();
});

test('init() should call setup.', function(t) {
  var val;
  document.body.innerHTML = '';
  System._records = [];
  System._pool = [];
  System.init(function() {val = this._records.length;});
  t.equal(val, 1, 'System._records should have at least 1 record when the function exits.');
  t.end();
});

test('add() should add create a new item and add it to _records.', function(t) {
  document.body.innerHTML = '';
  System._records = [];
  System._pool = [];
  System.setup();
  var itemA = System.add();
  t.assert(typeof itemA === 'object' && itemA.name === 'Item', 'add() should return the new item.');
  t.equal(System._records.length, 2, 'should add a new item to _records. item + world = 2 records.');
  function Box() {}
  Box.prototype.init = function() {};
  System.Classes.Box = Box;
  var box = System.add('Box');
  t.equal(typeof box, 'object', 'should return a reference to the added instance.');
  t.equal(System._records.length, 3, 'should add an instance of a custom class to _records. 2 items + world = 3 records.');
  t.end();
});

test('add() should pull from pull from System._pool if pooled items exist.', function(t) {
  document.body.innerHTML = '';
  System._records = [];
  System._pool = [];
  System.Classes = {};
  System.setup();
  var itemA = System.add();
  t.equal(System._records.length, 2, 'should add a new item to _records');
  System.remove(itemA);
  t.assert(System._records.length === 1 && System._pool.length === 1, 'remove() should remove item from _records and add to _pool.');
  var itemB = System.add();
  t.assert(System._records.length === 2 && System._pool.length === 0, 'add() should check to splice items off _pool.');
  t.end();
});

test('_cleanObj() should remove all properties from an object.', function(t) {
  var obj = {
    hi: 'hello'
  };
  System._cleanObj(obj);
  t.equal(typeof obj.hi, 'undefined', 'should remove property.');
  t.end();
});

test('remove() should hide an item and add it to _loop.', function(t) {
  document.body.innerHTML = '';
  System._records = [];
  System._pool = [];
  System.Classes = {};
  System.setup();
  System.add();
  t.equal(document.querySelectorAll('.item').length, 1, 'should append a DOM element to the document.body');
  System.remove(System._records[System._records.length - 1]);
  t.equal(System._records.length, 1, 'should remove instance from _records');
  t.equal(System._pool.length, 1, 'shoud add instance to _pool');
  t.end();
});

test('destroy() should call remove().', function(t) {
  document.body.innerHTML = '';
  System._records = [];
  System._pool = [];
  System.Classes = {};
  System.setup();
  System.add();
  t.equal(document.querySelectorAll('.item').length, 1, 'should append a DOM element to the document.body');
  System.destroy(System._records[System._records.length - 1]);
  t.equal(System._records.length, 1, 'should remove instance from _records');
  t.equal(System._pool.length, 1, 'shoud add instance to _pool');
  t.end();
});

test('loop() should call step() and draw().', function(t) {
  window.requestAnimationFrame = function() {};
  var world = new World(document.body);
  System._records = [];
  System._pool = [];
  System.Classes = {};
  System.setup(null, world);
  System.add('Item', {
    location: new Vector(100, 100)
  }, world);
  System.loop();
  t.equal(System._records[System._records.length - 1].location.y, 100.1, 'step() should update location.');
  t.equal(System._records[System._records.length - 1].acceleration.y, 0, 'step() should reset acceleration.');
  t.end();
});

test('_recordMouseLoc should record the mouse location on mousemove events.', function(t) {
  System._records = [];
  System._pool = [];
  System.Classes = {};
  System.setup();
  System.add();

  var e = {
    pageX: 100,
    pageY: 100
  };
  System._recordMouseLoc(e);
  t.assert(System.mouse.location.x === 100 && System.mouse.location.y === 100, 'records mouse location via pageX/Y.');

  var e = {
    clientX: 200,
    clientY: 200
  };
  System._recordMouseLoc(e);
  t.assert(System.mouse.location.x === 200 && System.mouse.location.y === 200, 'records mouse location via clientX/Y.');


  System.mouse.location.x = 90;
  System.mouse.location.y = 90;
  var e = {
    changedTouches: [
      {
        pageX: 100,
        pageY: 100
      }
    ]
  };
  System._recordMouseLoc(e);
  t.assert(System.mouse.location.x === 100 && System.mouse.location.y === 100, 'records mouse location via changedTouches.');
  t.assert(System.mouse.velocity.x === -10 && System.mouse.velocity.y === -10, 'records mouse velocity.');

  t.end();
});

test('firstWorld() returns the first world in the system.', function(t) {
  System._records = [];
  System._pool = [];
  System.Classes = {};
  System.setup();
  System.add();
  t.ok(System.firstWorld() instanceof World, 'return the first world.');
  t.end();
});

test('allWorlds() returns all worlds in the system.', function(t) {
  System._records = [];
  System._pool = [];
  System.Classes = {};
  System.setup();
  System.add();
  var div = document.createElement('div');
  var world = new World(div);
  System._addWorld(world);
  t.equal(System.allWorlds().length, 2, 'return all worlds.');
  t.ok(System.allWorlds()[0] instanceof World, 'first item is an instance of World.');
  t.ok(System.allWorlds()[1] instanceof World, 'second item is an instance of World.');
  t.end();
});

test('getAllItemsByName() returns all items of the passed name.', function(t) {
  System._records = [];
  System._pool = [];
  System.Classes = {};
  System.setup();
  System.add();
  System.add();
  System.add();
  t.equal(System.getAllItemsByName('Item').length, 3, 'return all items.');
  t.equal(System.getAllItemsByName('NoName').length, 0, 'returns an empty array.');
  t.end();
});

test('updateOrientation() resets world width/height.', function(t) {
  System._records = [];
  System._pool = [];
  System.Classes = {};
  System.setup();
  System.add();
  var documentWidth = document.body.scrollWidth;
  var documentHeight = document.body.scrollHeight;
  System.updateOrientation();
  var world = System.firstWorld();
  t.equal(world.width, documentWidth);
  t.equal(world.height, documentHeight);
  t.end();
});

test('_stepForward() should advance the System one step.', function(t) {
  var world = new World(document.body);
  System._records = [];
  System._pool = [];
  System.Classes = {};
  System.setup(null, world);
  System.add('Item', {
    location: new Vector(100, 100)
  }, world);
  System._stepForward();
  t.equal(System._records[System._records.length - 1].location.y, 100.1, '_stepForward() should update location.');
  t.equal(System._records[System._records.length - 1].acceleration.y, 0, '_stepForward() should reset acceleration.');
  t.end();
});

test('_keyup() should catch keyup events.', function(t) {

  var world = new World(document.body);
  System._records = [];
  System._pool = [];
  System.Classes = {};
  System.setup(null, world);
  System.add('Item', {
    location: new Vector(100, 100)
  }, world);
  System._keyup({
    keyCode: 39
  });
  t.equal(System._records[System._records.length - 1].location.y, 100.1, 'keyCode 39 should call _stepForward.');
  t.equal(System._records[System._records.length - 1].acceleration.y, 0, 'keyCode 39 should call _stepForward.');

  var world = new World(document.body);
  System._records = [];
  System._pool = [];
  System.Classes = {};
  System.setup(null, world);
  System.add('Item', {
    location: new Vector(100, 100)
  }, world);
  System._keyup({
    keyCode: 80
  });
  t.equal(System._records[0].pauseStep, true, 'keyCode 80 should set world.pauseStep = true.');

  var world = new World(document.body);
  System._records = [];
  System._pool = [];
  System.Classes = {};
  System.setup(null, world);
  System.add('Item', {
    location: new Vector(100, 100)
  }, world);
  System._keyup({
    keyCode: 82
  });
  t.equal(System._records.length, 1, 'should clear item.');

  document.body.innerHTML = '';
  StatsDisplay.init();
  StatsDisplay.hide();
  StatsDisplay.active = false;

  var world = new World(document.body);
  System._records = [];
  System._pool = [];
  System.Classes = {};
  System.setup(null, world);
  System.add('Item', {
    location: new Vector(100, 100)
  }, world);
  System._keyup({
    keyCode: 83
  });
  t.ok(StatsDisplay.active, 'should activate.');

  document.body.innerHTML = '';
  StatsDisplay.active = false;
  StatsDisplay.fps = false;
  System._keyup({
    keyCode: 83
  });
  t.ok(StatsDisplay.active, 'should call init() when StatsDisplay.fps = false.');

  document.body.innerHTML = '';
  StatsDisplay.init();
  StatsDisplay.fps = 1;
  System._keyup({
    keyCode: 83
  });
  var view = document.querySelectorAll('.statsDisplay')[0];
  t.equal(view.style.display, 'none', 'should hide the view.');

  t.end();
});



test('_resetSystem() should reset the system.', function(t) {
  System._records = [];
  System._pool = [];
  System.Classes = {};
  System.setup();
  System.add();
  t.equal(System._records.length, 2, 'should have a world and an item.');
  System._resetSystem();
  t.equal(System._records.length, 1, 'should clear all items.');

  System.add();
  System.remove(System._records[System._records.length - 1]);
  t.equal(System._pool.length, 1, 'should have 1 item in the pool.');
  System._resetSystem();
  t.equal(System._pool.length, 0, 'should clear the pool.');

  var world = System.firstWorld();
  world.pauseStep = true;
  world.pauseDraw = true;
  System._resetSystem();
  t.equal(world.pauseStep, false, 'should reset world.pauseStep.');
  t.equal(world.pauseDraw, false, 'should reset world.pauseDraw.');

  t.end();
});

