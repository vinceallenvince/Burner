var test = require('tape'),
    System = require('../src/System'),
    Vector = require('vector2d-lib'),
    Utils = require('drawing-utils-lib'),
    Item, obj;

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
  Item = require('../src/item');
  t.ok(Item, 'object loaded');
  t.end();
});

test('check static properties', function(t) {
  beforeTest();
  t.equal(Item._idCount, 0);
  t.equal(typeof Item._stylePosition, 'string', 'has a _stylePosition string for concatenating transforms.');
  t.end();
});

test('new Item() should create a new Item and add its view to the DOM.', function(t) {
  beforeTest();
  obj = new Item();
  t.equal(Item._idCount, 1, 'should increment Item._idCount.');
  t.end();
});

test('init() should require an instance of World.', function(t) {
  beforeTest();
  var world = new World();
  obj = new Item();
  t.throws(function () {
    obj.init();
  }, 'should throw exception when not passed an instance of World.');
  t.end();
});

test('init() should initialize with default properties.', function(t) {
  beforeTest();
  var world = new World();
  obj = new Item();
  obj.init(world);
  t.equal(obj.name, 'Item');
  t.equal(obj.width, 10, 'default width.');
  t.equal(obj.height, 10, 'default height.');
  t.equal(obj.scale, 1, 'default scale.');
  t.equal(obj.angle, 0, 'default angle.');
  t.equal(obj.colorMode, 'rgb', 'default colorMode.');
  t.assert(obj.color[0] === 200 && obj.color[1] === 200 && obj.color[2] === 200, 'default color.');
  t.equal(obj.borderWidth, 0, 'default borderWidth.');
  t.equal(obj.borderStyle, 'none', 'default borderStyle.');
  t.assert(obj.borderColor[0] === 255 && obj.borderColor[1] === 255 && obj.borderColor[2] === 255, 'default boderColor.');
  t.equal(obj.borderRadius, 0, 'default borderRadius.');
  t.equal(obj.boxShadowOffsetX, 0, 'default boxShadowOffsetX.');
  t.equal(obj.boxShadowOffsetY, 0, 'default boxShadowOffsetY.');
  t.equal(obj.boxShadowBlur, 0, 'default boxShadowBlur.');
  t.equal(obj.boxShadowSpread, 0, 'default boxShadowSpread.');
  t.equal(obj.opacity, 1, 'default opacity.');
  t.equal(obj.zIndex, 0, 'default zIndex.');
  t.equal(obj.visibility, 'visible', 'default visibility.');
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
  t.equal(obj.life, 0, 'default life.');
  t.equal(obj.lifespan, -1, 'default lifespan.');
  t.equal(obj.checkWorldEdges, true, 'default checkWorldEdges.');
  t.equal(obj.wrapWorldEdges, false, 'default checkWorldEdges.');
  t.equal(typeof obj.beforeStep, 'function', 'default beforeStep');
  t.equal(typeof obj.afterStep, 'function', 'default afterStep');
  t.equal(obj.controlCamera, false, 'default controlCamera.');
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
  beforeTest();
  var world = new World();
  obj = new Item();
  obj.init(world, {
    hello: 'hi',
    width: 50,
    height: 100,
    scale: 10,
    angle: 45,
    colorMode: 'hsl',
    color: [10, 20, 30],
    borderWidth: 6,
    borderStyle: 'double',
    borderColor: [110, 120, 130],
    borderRadius: 60,
    boxShadowOffsetX: 4,
    boxShadowOffsetY: 8,
    boxShadowBlur: 5,
    boxShadowSpread: 20,
    opacity: 0.5,
    zIndex: 10,
    visibility: 'hidden',
    mass: 300,
    acceleration: new Vector(5, 10),
    velocity: new Vector(5, 10),
    location: new Vector(100, 200),
    maxSpeed: 50,
    minSpeed: 8,
    bounciness: 0.9,
    life: 0,
    lifespan: 100,
    checkWorldEdges: false,
    wrapWorldEdges: true,
    beforeStep: function() {return 100;},
    afterStep: function() {return 200;},
    controlCamera: true
  });
  t.equal(obj.width, 50, 'custom width.');
  t.equal(obj.height, 100, 'custom height.');
  t.equal(obj.scale, 10, 'custom scale.');
  t.equal(obj.angle, 45, 'custom angle.');
  t.equal(obj.colorMode, 'hsl', 'custom colorMode.');
  t.assert(obj.color[0] === 10 && obj.color[1] === 20 && obj.color[2] === 30, 'custom color.');
  t.equal(obj.borderWidth, 6, 'custom borderWidth.');
  t.equal(obj.borderStyle, 'double', 'custom borderStyle.');
  t.assert(obj.borderColor[0] === 110 && obj.borderColor[1] === 120 && obj.borderColor[2] === 130, 'custom boderColor.');
  t.equal(obj.borderRadius, 60, 'custom borderRadius.');
  t.equal(obj.boxShadowOffsetX, 4, 'custom boxShadowOffsetX.');
  t.equal(obj.boxShadowOffsetY, 8, 'custom boxShadowOffsetY.');
  t.equal(obj.boxShadowBlur, 5, 'custom boxShadowBlur.');
  t.equal(obj.boxShadowSpread, 20, 'custom boxShadowSpread.');
  t.equal(obj.opacity, 0.5, 'custom opacity.');
  t.equal(obj.zIndex, 10, 'custom zIndex.');
  t.equal(obj.visibility, 'hidden', 'custom visibility.');
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
  t.equal(obj.life, 0, 'custom life.');
  t.equal(obj.lifespan, 100, 'custom lifespan.');
  t.equal(obj.checkWorldEdges, false, 'custom checkWorldEdges.');
  t.equal(obj.wrapWorldEdges, true, 'custom wrapWorldEdges.');
  t.equal(obj.beforeStep(), 100, 'custom beforeStep');
  t.equal(obj.afterStep(), 200, 'custom afterStep');
  t.equal(obj.controlCamera, true, 'custom controlCamera.');
  t.end();
});

test('init() should initialize with inherited properties.', function(t) {
  beforeTest();
  function Obj() {
    this.name = 'Obj';
    this.width = 100;
    this.height = 100;
    this.scale = 0.5;
    this.angle = 35;
    this.colorMode = 'hsl';
    this.color = [105, 100, 100];
    this.borderWidth = 12;
    this.borderStyle = 'dotted';
    this.borderColor = [200, 202, 220],
    this.borderRadius = 80;
    this.boxShadowOffsetX = 8;
    this.boxShadowOffsetY = 12;
    this.boxShadowBlur = 10;
    this.boxShadowSpread = 25;
    this.opacity = 0.25;
    this.zIndex = 20;
    this.visibility = 'hidden';
    this.mass = 200;
    this.acceleration = new Vector(5, 10);
    this.velocity = new Vector(2, 8);
    this.location = new Vector(30, 40);
    this.maxSpeed = 20;
    this.minSpeed = 2;
    this.bounciness = 2;
    this.life = 0;
    this.lifespan = 100;
    this.checkWorldEdges = false;
    this.wrapWorldEdges = true;
    this.beforeStep = false;
    this.afterStep = false;
    this.controlCamera = true;
    Item.call(this);
  }
  Utils.extend(Obj, Item);
  System.Classes = {
    Obj: Obj
  };
  var obj;
  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Obj'); // add your new object to the system
  });
  t.equal(obj.width, 100, 'inherited width');
  t.equal(obj.height, 100, 'inherited height');
  t.equal(obj.scale, 0.5, 'inherited scale');
  t.equal(obj.angle, 35, 'inherited angle');
  t.equal(obj.colorMode, 'hsl', 'inherited colorMode');
  t.assert(obj.color[0] === 105 && obj.color[1] === 100 && obj.color[2] === 100, 'inherited color.');
  t.equal(obj.borderWidth, 12, 'inherited borderWidth.');
  t.equal(obj.borderStyle, 'dotted', 'inherited borderStyle.');
  t.assert(obj.borderColor[0] === 200 && obj.borderColor[1] === 202 && obj.borderColor[2] === 220, 'inherited boderColor.');
  t.equal(obj.borderRadius, 80, 'inherited borderRadius.');
  t.equal(obj.boxShadowOffsetX, 8, 'inherited boxShadowOffsetX.');
  t.equal(obj.boxShadowOffsetY, 12, 'inherited boxShadowOffsetY.');
  t.equal(obj.boxShadowBlur, 10, 'inherited boxShadowBlur.');
  t.equal(obj.boxShadowSpread, 25, 'inherited boxShadowSpread.');
  t.equal(obj.opacity, 0.25, 'inherited opacity');
  t.equal(obj.zIndex, 20, 'inherited zIndex');
  t.equal(obj.visibility, 'hidden', 'inherited visibility.');
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
  t.equal(obj.life, 0, 'inherited life.');
  t.equal(obj.lifespan, 100, 'inherited lifespan.');
  t.equal(obj.checkWorldEdges, false, 'inherited checkWorldEdges');
  t.equal(obj.wrapWorldEdges, true, 'inherited wrapWorldEdges');
  t.equal(obj.beforeStep, false, 'inherited beforeStep');
  t.equal(obj.afterStep, false, 'inherited afterStep');
  t.equal(obj.controlCamera, true, 'inherited controlCamera.');

  document.body.innerHTML = '';
  System._records = [];
  System._pool = [];
  System.Classes = {};

  t.end();
});

test('step() should calculate a new location.', function(t) {

  beforeTest();

  var before, after;

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Item', {
      location: new Vector(100, 100),
      beforeStep: function() {before = 150;},
      afterStep: function() {after = 300;}
    });
  });
  obj.step();

  t.equal(obj.acceleration.x, 0, 'reset acceleration x.');
  t.equal(obj.acceleration.y, 0, 'reset acceleration y.');
  t.equal(obj.velocity.x, 0, 'new velocity x.');
  t.equal(obj.velocity.y, 0.1, 'new velocity y.');
  t.equal(obj.location.x, 100, 'new location x.');
  t.equal(obj.location.y, 100.1, 'new location y.');
  t.equal(before, 150, 'beforeStep() executes.');
  t.equal(after, 300, 'afterStep() executes.');

  //
  //
  beforeTest();

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Item', {
      location: new Vector(0, 0),
      checkWorldEdges: false,
      wrapWorldEdges: true
    });
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

  beforeTest();

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

  beforeTest();

  var world = new World();
  obj = new Item();
  obj.init(world, {
    location: new Vector()
  });
  obj.location.x = world.width + obj.width;
  obj._wrapWorldEdges();
  t.equal(obj.location.x, -obj.width / 2, 'wrapWorldEdges should move obj x.location to world left boundary.');

  obj.location.x = -obj.width;
  obj._wrapWorldEdges();
  t.equal(obj.location.x, world.width + obj.width / 2, 'wrapWorldEdges should move obj x.location to world right boundary.');

  obj.location.y =  world.height + obj.height;
  obj._wrapWorldEdges();
  t.equal(obj.location.y, -obj.height / 2, 'wrapWorldEdges should move obj y.location to world top boundary.');

  obj.location.y = -obj.height;
  obj._wrapWorldEdges();
  t.equal(obj.location.y, world.height + obj.height / 2, 'wrapWorldEdges should move obj y.location to world bottom boundary.');

  t.end();
});

test('checkCameraEdges() should calculate a new location for world.', function(t) {

  beforeTest();

  System.setup(function() {
    var world = this.add('World', {
      el: document.getElementById('world'),
      width: 400,
      height: 300
    });
    obj = this.add('Item', {
      controlCamera: true
    });
  });
  obj.step();
  obj.world.step();
  // TODO: fix
  //t.equal(obj.world.location.x, 200, 'checkCameraEdges should move world x pos in opposite direction from item.');
  //t.equal(obj.world.location.y, 149.9, 'checkCameraEdges should move world y pos in opposite direction from item.');

  t.end();
});
