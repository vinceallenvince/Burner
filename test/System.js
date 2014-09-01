var test = require('tape'),
    Item = require('../src/Item'),
    Utils = require('drawing-utils-lib'),
    Vector = require('vector2d-lib'),
    World = require('../src/World'),
    FPSDisplay = require('fpsdisplay'),
    System, obj;

function beforeTest() {
  System.setupFunc = function() {};
  System._resetSystem();
  document.body.innerHTML = '';
  var world = document.createElement('div');
  world.id = 'world';
  world.style.position = 'absolute';
  world.style.top = '0';
  world.style.left = '0';
  document.body.appendChild(world);
}

test('load System.', function(t) {
  System = require('../src/system');
  t.ok(System, 'object loaded');
  t.end();
});

test('check static properties.', function(t) {
  beforeTest();
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

test('setup() should execute a passed callback.', function(t) {

  beforeTest();

  var val = 0;

  System.setup(function() {val = 100;});
  t.equal(val, 100, 'System should call setup function.');
  t.equal(typeof System.setupFunc, 'function', 'should save the setup callback in case we need to reset the system.');
  t.end();
});

test('setup() should assign a noop as a callback if one is not supplied.', function(t) {

  beforeTest();

  var val = 0;

  System.setup();
  t.notOk(System.setupFunc(), 'System should call noop setup function.');
  t.end();
});

test('init() should call setup.', function(t) {

  beforeTest();

  var val = 0;

  System.init(function() {val = 100;});
  t.equal(val, 100, 'System should call setup function via init().');
  t.end();
});

test('add() should add create a new item and add it to _records.', function(t) {

  beforeTest();

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    var itemA = this.add();
    t.assert(typeof itemA === 'object' && itemA.name === 'Item', 'add() should return the new item.');
    t.equal(System._records.length, 2, 'should add a new item to _records. item + world = 2 records.');
  });

  t.end();
});

test('add() should pull from pull from System._pool if pooled items exist.', function(t) {

  beforeTest();

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });;

    var itemA = this.add();
    System.remove(itemA);
    t.assert(System._records.length === 1 && System._pool.length === 1, 'remove() should remove item from _records and add to _pool.');

    var itemB = this.add();
    t.assert(System._records.length === 2 && System._pool.length === 0, 'add() should check to splice items off _pool.');

  });

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

  beforeTest();

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    this.add();
  });

  t.equal(document.querySelectorAll('.item').length, 1, 'should append a DOM element to the document.body');

  System.remove(System._records[System._records.length - 1]);
  t.equal(document.querySelectorAll('.item')[0].style.visibility, 'hidden', 'DOM element visibility should be hidden.');
  t.equal(System._records.length, 1, 'should remove instance from _records');
  t.equal(System._pool.length, 1, 'shoud add instance to _pool');
  t.end();
});

test('destroy() should call remove().', function(t) {

  beforeTest();

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    this.add();
  });

  System.destroy(System._records[System._records.length - 1]);
  t.equal(document.querySelectorAll('.item')[0].style.visibility, 'hidden', 'DOM element visibility should be hidden.');
  t.equal(System._records.length, 1, 'should remove instance from _records');
  t.equal(System._pool.length, 1, 'shoud add instance to _pool');
  t.end();
});

test('loop() should call step() and draw().', function(t) {

  window.requestAnimationFrame = function() {};

  beforeTest();

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    this.add('Item', {
      location: new Vector(100, 100),
      lifespan: 10
    });
  });
  System.loop();
  t.equal(System._records[System._records.length - 1].location.y, 100.1, 'step() should update location.');
  t.equal(System._records[System._records.length - 1].acceleration.y, 0, 'step() should reset acceleration.');
  t.equal(System._records[System._records.length - 1].life, 1, 'step() should increment life.');
  t.equal(System.clock, 1, 'loop() should increment clock.');

  //
  //

  beforeTest();

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    this.add('Item', {
      location: new Vector(100, 100),
      life: 10,
      lifespan: 10
    });
  });
  System.loop();
  t.equal(System._records.length, 1, 'step() should remove object if life >= lifespan.');

  t.end();
});

test('_recordMouseLoc should record the mouse location on mousemove events.', function(t) {

  beforeTest();

  System.setup(function() {
    this.add('World', {
      width: 100,
      height: 100
    });
    this.add();
  });

  var e = {
    pageX: 100,
    pageY: 150
  };
  System._recordMouseLoc(e); // TODO: fix
  // t.assert(System.mouse.location.x === 25 && System.mouse.location.y === 50, 'records mouse location via pageX/Y.');

  var e = {
    clientX: 100,
    clientY: 150
  };
  System._recordMouseLoc(e); // TODO: fix
  // t.assert(System.mouse.location.x === 25 && System.mouse.location.y === 50, 'records mouse location via clientX/Y.');


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

  beforeTest();

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    this.add();
  });

  t.ok(System.firstWorld() instanceof World, 'return the first world.');
  t.end();
});

test('allWorlds() returns all worlds in the system.', function(t) {

  beforeTest();

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    this.add();
  });

  var div = document.createElement('div');
  var world = new World({el: div});
  System._addWorld(world);
  t.equal(System.allWorlds().length, 2, 'return all worlds.');
  t.ok(System.allWorlds()[0] instanceof World, 'first item is an instance of World.');
  t.ok(System.allWorlds()[1] instanceof World, 'second item is an instance of World.');
  t.end();
});

test('getAllItemsByName() returns all items of the passed name.', function(t) {

  beforeTest();

  function Fruit(opt_options) {
    Item.call(this);
    this.name = 'Fruit';
  }
  Utils.extend(Fruit, Item);

  Fruit.prototype.init = function(world, opt_options) {
    Fruit._superClass.init.call(this, world, opt_options);
    var options = opt_options;
    this.type = options.type || false;
  };

  //

  function Computer(opt_options) {
    Item.call(this);
    this.name = 'Computer';
  }
  Utils.extend(Computer, Item);

  Computer.prototype.init = function(world, opt_options) {
    Computer._superClass.init.call(this, world, opt_options);
    var options = opt_options;
    this.type = options.type || false;
  };

  System.Classes = {
    Fruit: Fruit,
    Computer: Computer
  };

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    this.add('Fruit');
    this.add('Fruit', {
      type: 'Apple'
    });
    this.add('Fruit', {
      type: 'Orange'
    });
    this.add('Computer');
    this.add('Computer', {
      type: 'Apple'
    });
    this.add('Computer', {
      type: 'Commodore'
    });
  });
  t.equal(System.getAllItemsByAttribute('type').length, 6, 'returns items w \'type\' property.');
  t.equal(System.getAllItemsByAttribute('type', 'Orange').length, 1, 'returns items type = \'Orange\'');
  t.equal(System.getAllItemsByAttribute('type', 'Orange', 'Fruit').length, 1, 'returns items Fruit.type = \'Orange\'');
  t.equal(System.getAllItemsByAttribute('type', 'Apple').length, 2, 'returns item type = \'Apple\'');
  t.equal(System.getAllItemsByAttribute('type', 'Apple', 'Computer').length, 1, 'returns item Computer.type = \'Apple\'');
  t.end();
});

test('getAllItemsByName() returns all items of the passed name.', function(t) {
  beforeTest();

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    this.add();
    this.add();
    this.add();
  });
  t.equal(System.getAllItemsByName('Item').length, 3, 'return all items.');
  t.equal(System.getAllItemsByName('NoName').length, 0, 'returns an empty array.');
  t.end();
});

test('updateOrientation() resets world width/height.', function(t) {
  beforeTest();

  System.setup(function() {
    this.add('World');
    this.add();
  });
  var documentWidth = document.body.scrollWidth;
  var documentHeight = document.body.scrollHeight;
  System.updateOrientation();
  var world = System.firstWorld();
  t.equal(world.width, documentWidth);
  t.equal(world.height, documentHeight);
  t.end();
});

test('_stepForward() should advance the System one step.', function(t) {
  beforeTest();

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    this.add('Item', {
      location: new Vector(100, 100)
    });
  });
  System._stepForward();
  t.equal(System._records[System._records.length - 1].location.y, 100.1, '_stepForward() should update location.');
  t.equal(System._records[System._records.length - 1].acceleration.y, 0, '_stepForward() should reset acceleration.');
  t.end();
});

test('_keyup() should catch keyup events.', function(t) {

  beforeTest();

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    this.add('Item', {
      location: new Vector(100, 100)
    });
  });
  System._keyup({
    keyCode: 39
  });
  t.equal(System._records[System._records.length - 1].location.y, 100.1, 'keyCode 39 should call _stepForward.');
  t.equal(System._records[System._records.length - 1].acceleration.y, 0, 'keyCode 39 should call _stepForward.');

  //
  //
  beforeTest();

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    this.add('Item', {
      location: new Vector(100, 100)
    });
  });
  System._keyup({
    keyCode: 80 // pause/play
  });
  t.equal(System._records[0].pauseStep, true, 'keyCode 80 should set world.pauseStep = true.');
  System._keyup({
    keyCode: 80 // pause/play
  });
  t.equal(System._records[0].pauseStep, false, 'keyCode 80 should set world.pauseStep = false.');

  //
  //
  beforeTest();

  var world;

  System.setup(function() {
    world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    this.add('Item', {
      location: new Vector(100, 100)
    });
  });
  System.setupFunc = function() {};
  System._keyup({
    keyCode: 82 // reset
  });
  t.equal(System._records.length, 0, 'should remove all items.');

  world.innerHTML = '';
  FPSDisplay.init();
  FPSDisplay.hide();
  FPSDisplay.active = false;

  //
  // TODO: fix
  /*beforeTest();

  var world;

  System.setup(function() {
    world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    this.add('Item', {
      location: new Vector(100, 100)
    });
  });
  System._keyup({
    keyCode: 83
  });
  t.ok(FPSDisplay.active, 'should activate.');

  world.innerHTML = '';
  FPSDisplay.active = false;
  FPSDisplay.fps = false;
  System._keyup({
    keyCode: 83
  });
  t.ok(FPSDisplay.active, 'should call init() when FPSDisplay.fps = false.');

  world.innerHTML = '';
  FPSDisplay.init();
  FPSDisplay.fps = 1;
  System._keyup({
    keyCode: 83
  });
  var view = document.querySelectorAll('.statsDisplay')[0];
  t.equal(view.style.display, 'none', 'should hide the view.');
  */

  t.end();
});



test('_resetSystem() should reset the system.', function(t) {

  beforeTest();

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    this.add('Item', {
      location: new Vector(100, 100)
    });
  });
  System.setupFunc = function() {};
  System._resetSystem();
  t.equal(System._records.length, 0, 'should clear all items.');

  //
  //
  beforeTest();

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    this.add('Item', {
      location: new Vector(100, 100)
    });
  });

  System.remove(System._records[System._records.length - 1]);
  t.equal(System._pool.length, 1, 'should have 1 item in the pool.');
  System._resetSystem();
  t.equal(System._pool.length, 0, 'should clear the pool.');

  //
  //
  beforeTest();

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    this.add('Item', {
      location: new Vector(100, 100)
    });
  });

  var world = System.firstWorld();
  world.pauseStep = true;
  world.pauseDraw = true;
  System._resetSystem();
  t.equal(world.pauseStep, false, 'should reset world.pauseStep.');
  t.equal(world.pauseDraw, false, 'should reset world.pauseDraw.');

  t.end();
});

