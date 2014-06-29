var test = require('tape'),
    System = require('../src/System').System,
    Vector = require('../src/Vector').Vector,
    Utils = require('../src/Utils').Utils,
    Item, obj;

function World() {
  this.width = 5000;
  this.height = 5000;
  this.gravity = new Vector(0, 1);
  this.wind = new Vector();
  this.c = 0.1;
}
World.prototype.init = function() {};
World.prototype.step = function() {};
World.prototype.draw = function() {};
World.prototype.add = function(item) {
  document.body.appendChild(item);
};

test('load Item.', function(t) {
  Item = require('../src/Item').Item;
  t.ok(Item, 'object loaded');
  t.end();
});

test('check static properties', function(t) {
  t.equal(Item._idCount, 0);
  t.equal(typeof Item._stylePosition, 'string', 'has a _stylePosition string for concatenating transforms.');
  t.end();
});

test('new Item() should create a new Item and add its view to the DOM.', function(t) {
  obj = new Item();
  t.equal(Item._idCount, 1, 'should increment Item._idCount.');
  t.end();
});

test('init() should require an instance of World.', function(t) {
  document.body.innerHTML = '';
  var world = new World();
  obj = new Item();
  t.throws(function () {
    obj.init();
  }, 'should throw exception when not passed an instance of World.');
  t.end();
});

test('init() should initialize with default properties.', function(t) {
  document.body.innerHTML = '';
  var world = new World();
  obj = new Item();
  obj.init(world);
  t.equal(obj.name, 'Item');
  t.equal(obj.width, 10, 'default width.');
  t.equal(obj.height, 10, 'default height.');
  t.equal(obj.scale, 1, 'default scale.');
  t.equal(obj.angle, 0, 'default angle.');
  t.equal(obj.color[0], 0, 'default color red.');
  t.equal(obj.color[1], 0, 'default color green.');
  t.equal(obj.color[2], 0, 'default color blue.');
  t.equal(obj.mass, 10, 'default mass.');
  t.equal(obj.acceleration.x, 0, 'default acceleration x');
  t.equal(obj.acceleration.y, 0, 'default acceleration y');
  t.equal(obj.velocity.x, 0, 'default velocity x');
  t.equal(obj.velocity.y, 0, 'default velocity y');
  t.equal(typeof obj.location.x, 'number', 'default location x');
  t.equal(typeof obj.location.y, 'number', 'default location y');
  t.equal(obj.maxSpeed, 10, 'default maxSpeed.');
  t.equal(obj.minSpeed, 0, 'default minSpeed.');
  t.equal(obj.bounciness, 0.5, 'default bounciness.');
  t.equal(obj.checkWorldEdges, true, 'default checkWorldEdges.');
  t.equal(obj.wrapWorldEdges, false, 'default checkWorldEdges.');
  t.equal(typeof obj.beforeStep, 'function', 'default beforeStep');
  t.equal(obj._force.x, 0, 'force cache x.');
  t.equal(obj._force.y, 0, 'force cache y.');
  t.equal(obj.id, 'Item3', 'should have an id.');
  t.equal(typeof obj.el, 'object', 'should have a DOM element as a view.');
  t.equal(obj.el.style.position, 'absolute', 'should have absolute positioning.');
  t.equal(obj.el.style.top, '-5000px', 'should be positioned off screen.');
  t.equal(document.querySelectorAll('.item').length, 1, 'should append a DOM element to the document.body');
  t.end();
});

test('init() should initialize with custom properties.', function(t) {
  document.body.innerHTML = '';
  var world = new World();
  obj = new Item();
  obj.init(world, {
    hello: 'hi',
    width: 50,
    height: 100,
    scale: 10,
    angle: 45,
    color: [10, 20, 30],
    mass: 300,
    acceleration: new Vector(5, 10),
    velocity: new Vector(5, 10),
    location: new Vector(100, 200),
    maxSpeed: 50,
    minSpeed: 8,
    bounciness: 0.9,
    checkWorldEdges: false,
    wrapWorldEdges: true,
    beforeStep: function() {return 100;}
  });
  t.equal(obj.width, 50, 'custom width.');
  t.equal(obj.height, 100, 'custom height.');
  t.equal(obj.scale, 10, 'custom scale.');
  t.equal(obj.angle, 45, 'custom angle.');
  t.equal(obj.color[0], 10, 'custom color red.');
  t.equal(obj.color[1], 20, 'custom color green.');
  t.equal(obj.color[2], 30, 'custom color blue.');
  t.equal(obj.mass, 300, 'custom mass.');
  t.equal(obj.acceleration.x, 5, 'custom acceleration x');
  t.equal(obj.acceleration.y, 10, 'custom acceleration y');
  t.equal(obj.velocity.x, 5, 'custom velocity x');
  t.equal(obj.velocity.y, 10, 'custom velocity y');
  t.equal(obj.location.x, 100, 'custom location x');
  t.equal(obj.location.y, 200, 'custom location y');
  t.equal(obj.maxSpeed, 50, 'custom maxSpeed.');
  t.equal(obj.minSpeed, 8, 'custom minSpeed.');
  t.equal(obj.bounciness, 0.9, 'custom bounciness.');
  t.equal(obj.checkWorldEdges, false, 'custom checkWorldEdges.');
  t.equal(obj.wrapWorldEdges, true, 'custom wrapWorldEdges.');
  t.equal(obj.beforeStep(), 100, 'custom beforeStep');
  t.end();
});

test('init() should initialize with inherited properties.', function(t) {
  function Obj() {
    this.name = 'Obj';
    this.width = 100;
    this.height = 100;
    this.scale = 0.5;
    this.angle = 35;
    this.color = [105, 100, 100];
    this.mass = 200;
    this.acceleration = new Vector(5, 10);
    this.velocity = new Vector(2, 8);
    this.location = new Vector(30, 40);
    this.maxSpeed = 20;
    this.minSpeed = 2;
    this.bounciness = 2;
    this.checkWorldEdges = false;
    this.wrapWorldEdges = true;
    this.beforeStep = false;
    Item.call(this);
  }
  Utils.extend(Obj, Item);
  System.Classes = {
    Obj: Obj
  };
  var obj;
  System.setup(function() {
    obj = this.add('Obj'); // add your new object to the system
  });
  t.equal(obj.width, 100, 'inherited width');
  t.equal(obj.height, 100, 'inherited height');
  t.equal(obj.scale, 0.5, 'inherited scale');
  t.equal(obj.angle, 35, 'inherited angle');
  t.equal(obj.color[0], 105, 'inherited color');
  t.equal(obj.mass, 200, 'inherited mass');
  t.equal(obj.acceleration.x, 5, 'inherited acceleration.x');
  t.equal(obj.acceleration.y, 10, 'inherited acceleration.y');
  t.equal(obj.velocity.x, 2, 'inherited velocity.x');
  t.equal(obj.velocity.y, 8, 'inherited velocity.y');
  t.equal(obj.location.x, 30, 'inherited location.x');
  t.equal(obj.location.y, 40, 'inherited location.y');
  t.equal(obj.maxSpeed, 20, 'inherited maxSpeed');
  t.equal(obj.minSpeed, 2, 'inherited minSpeed');
  t.equal(obj.bounciness, 2, 'inherited bounciness');
  t.equal(obj.checkWorldEdges, false, 'inherited checkWorldEdges');
  t.equal(obj.wrapWorldEdges, true, 'inherited wrapWorldEdges');
  t.equal(obj.beforeStep, false, 'inherited beforeStep');

  document.body.innerHTML = '';
  System._records = [];
  System._pool = [];
  System.Classes = {};

  t.end();
});

test('step() should calculate a new location.', function(t) {
  document.body.innerHTML = '';
  var world = new World();
  obj = new Item();
  obj.init(world, {
    location: new Vector(100, 100),
    checkWorldEdges: true
  });
  obj.step();
  t.equal(obj.acceleration.x, 0, 'reset acceleration x.');
  t.equal(obj.acceleration.y, 0, 'reset acceleration y.');
  t.equal(obj.velocity.x, 0, 'new velocity x.');
  t.equal(obj.velocity.y, 0.1, 'new velocity y.');
  t.equal(obj.location.x, 100, 'new location x.');
  t.equal(obj.location.y, 100.1, 'new location y.');

  document.body.innerHTML = '';
  var world = new World();
  world.gravity.y = -1;
  obj = new Item();
  obj.init(world, {
    location: new Vector(0, 0),
    checkWorldEdges: false,
    wrapWorldEdges: true
  });
  obj.step();
  t.assert(obj.location.y > 0, 'checkWorldEdges: false, wrapWorldEdges: true; new location y should wrap to bottom of the document.body.');
  t.end();
});

test('applyForce() should return a new acceleration.', function(t) {
  document.body.innerHTML = '';
  var world = new World();
  obj = new Item();
  obj.init(world);
  var force = new Vector(0, 100);
  obj.applyForce(force);
  t.equal(obj.acceleration.y, 10, '');
  t.end();
});

test('checkWorldEdges() should calculate a new location.', function(t) {
  document.body.innerHTML = '';
  var world = new World();
  obj = new Item();
  obj.init(world, {
    location: new Vector(world.width + 10, 0)
  });
  obj._checkWorldEdges();
  t.equal(obj.location.x, world.width - obj.width / 2, 'checkWorldEdges should restrict obj x.location to world right boundary.');

  obj.location.x = -100;
  obj._checkWorldEdges();
  t.equal(obj.location.x, obj.width / 2, 'checkWorldEdges should restrict obj x.location to world left boundary.');

  obj.location.y = -100;
  obj._checkWorldEdges();
  t.equal(obj.location.y, obj.height / 2, 'checkWorldEdges should restrict obj y.location to world top boundary.');

  obj.location.y = world.height + 100;
  obj._checkWorldEdges();
  t.assert(obj.location.y < world.height, 'checkWorldEdges should restrict obj y.location to world bottom boundary.');
  // used less than here bc phantomjs body height is unpredictable
  t.end();
});

test('wrapWorldEdges() should calculate a new location.', function(t) {
  document.body.innerHTML = '';
  var world = new World();
  obj = new Item();
  obj.init(world, {
    location: new Vector()
  });
  obj.location.x = world.width + 10;
  obj._wrapWorldEdges();
  t.equal(obj.location.x, obj.width / 2, 'wrapWorldEdges should restrict obj x.location to world left boundary.');

  obj.location.x = -100;
  obj._wrapWorldEdges();
  t.equal(obj.location.x, world.width - obj.width / 2, 'checkWorldEdges should restrict obj x.location to world right boundary.');

  obj.location.y = -100;
  obj._wrapWorldEdges();
  t.assert(obj.location.y < world.height && obj.location.y > 0, 'checkWorldEdges should restrict obj y.location to world bottom boundary.');
  // used less than here bc phantomjs body height is unpredictable
  //
  obj.location.y = world.height + 100;
  obj._wrapWorldEdges();
  t.equal(obj.location.y, obj.height / 2, 'checkWorldEdges should restrict obj y.location to world top boundary.');

  t.end();
});

