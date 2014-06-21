var test = require('tape'),
    System = require('../src/System').System,
    Vector = require('../src/Vector').Vector,
    Item, obj;

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
  obj = new Item(System);
  t.equal(typeof obj.system, 'object', 'should have a system.');
  t.equal(typeof obj.world, 'object', 'should have a world.');
  t.equal(Item._idCount, 1, 'should increment Item._idCount.');
  t.throws(function () {
    new Item();
  }, 'should throw exception when not passed a system.');
  t.end();
});

test('init() should initialize with default properties.', function(t) {
  obj = new Item(System);
  obj.init();
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
  t.equal(obj._force.x, 0, 'force cache.');
  t.equal(obj._force.y, 0, 'force cache.');
  t.equal(obj.id, 'Item2', 'should have an id.');
  t.equal(typeof obj.el, 'object', 'should have a DOM element as a view.');
  t.equal(obj.el.style.position, 'absolute', 'should have absolute positioning.');
  t.equal(obj.el.style.top, '-5000px', 'should be positioned off screen.');
  t.equal(document.querySelectorAll('.item').length, 1, 'should append a DOM element to the document.body');
  t.end();
});


test('init() should initialize with custom properties.', function(t) {
  obj = new Item(System);
  obj.init({
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
  t.equal(obj.hello, 'hi', 'should accept any property.');
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
  t.equal(obj.beforeStep(), 100, 'custom beforeStep')
  t.end();
});

test('step() should calculate a new location.', function(t) {
  obj = new Item(System);
  obj.init({
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

  System.gravity.y = -1;
  obj = new Item(System);
  obj.init({
    location: new Vector(0, 0),
    checkWorldEdges: false,
    wrapWorldEdges: true
  });
  obj.step();
  t.assert(obj.location.y > 0, 'checkWorldEdges: false, wrapWorldEdges: true; new location y should wrap to bottom of the document.body.');
  System.gravity.y = 1;
  t.end();
});

test('applyForce() should return a new acceleration.', function(t) {
  obj = new Item(System);
  obj.init();
  var force = new Vector(0, 100);
  obj.applyForce(force);
  t.equal(obj.acceleration.y, 10, '');
  t.end();
});

test('checkWorldEdges() should calculate a new location.', function(t) {
  obj = new Item(System);
  obj.init({
    location: new Vector(document.body.scrollWidth + 10, 0)
  });
  obj._checkWorldEdges();
  t.equal(obj.location.x, document.body.scrollWidth - obj.width / 2, 'checkWorldEdges should restrict obj x.location to world right boundary.');

  obj.location.x = -100;
  obj._checkWorldEdges();
  t.equal(obj.location.x, obj.width / 2, 'checkWorldEdges should restrict obj x.location to world left boundary.');

  obj.location.y = -100;
  obj._checkWorldEdges();
  t.equal(obj.location.y, obj.height / 2, 'checkWorldEdges should restrict obj y.location to world top boundary.');

  obj.location.y = document.body.scrollHeight + 100;
  obj._checkWorldEdges();
  t.assert(obj.location.y < document.body.scrollHeight, 'checkWorldEdges should restrict obj y.location to world bottom boundary.');
  // used less than here bc phantomjs body height is unpredictable
  t.end();
});

test('wrapWorldEdges() should calculate a new location.', function(t) {
  obj = new Item(System);
  obj.init({
    location: new Vector()
  });
  obj.location.x = document.body.scrollWidth + 10;
  obj._wrapWorldEdges();
  t.equal(obj.location.x, obj.width / 2, 'wrapWorldEdges should restrict obj x.location to world left boundary.');

  obj.location.x = -100;
  obj._wrapWorldEdges();
  t.equal(obj.location.x, document.body.scrollWidth - obj.width / 2, 'checkWorldEdges should restrict obj x.location to world right boundary.');

  obj.location.y = -100;
  obj._wrapWorldEdges();
  t.assert(obj.location.y < document.body.scrollHeight && obj.location.y > 0, 'checkWorldEdges should restrict obj y.location to world bottom boundary.');
  // used less than here bc phantomjs body height is unpredictable
  //
  obj.location.y = document.body.scrollHeight + 100;
  obj._wrapWorldEdges();
  t.equal(obj.location.y, obj.height / 2, 'checkWorldEdges should restrict obj y.location to world top boundary.');

  t.end();
});

