var test = require('tape'),
    Item = require('../src/Item').Item,
    Vector = require('../src/Vector').Vector,
    Utils = require('../src/Utils').Utils,
    World, obj;

test('load World.', function(t) {
  World = require('../src/World').World;
  t.ok(World, 'object loaded');
  t.end();
});


test('new Item() should create a new Item and add its view to the DOM.', function(t) {
  var view = document.body;
  var obj = new World(view);
  t.equal(typeof obj.el, 'object', 'should have a view.');
  t.equal(obj.name, 'World', 'should have a name.');
  t.throws(function () {
    new World();
  }, 'should throw exception when not passed a DOM element.');
  t.end();
});

test('init() should initialize with default properties.', function(t) {
  var view = document.createElement('div');
  view.style.position = 'absolute';
  view.style.top = '0';
  view.style.left = '0';
  view.style.width = '100px';
  view.style.height = '100px';
  document.body.appendChild(view);
  obj = new World(view);
  obj.init();
  t.equal(obj.width, 100, 'Default width.');
  t.equal(obj.height, 100, 'Default height.');
  t.equal(obj.gravity.x, 0, 'Default gravity x.');
  t.equal(obj.gravity.y, 1, 'Default gravity y.');
  t.equal(obj.c, 0.1, 'Default c.');
  t.equal(obj.pauseStep, false, 'Default pauseStep.');
  t.equal(obj.pauseDraw, false, 'Default pauseDraw.');
  t.end();
});

test('init() should initialize with default properties.', function(t) {
  var view = document.createElement('div');
  view.style.position = 'absolute';
  view.style.top = '0';
  view.style.left = '0';
  view.style.width = '100px';
  view.style.height = '100px';
  document.body.appendChild(view);
  obj = new World(view);
  obj.init({
    width: 200,
    height: 200,
    gravity: new Vector(10, 20),
    c: 10,
    pauseStep: true,
    pauseDraw: true
  });
  t.equal(obj.width, 200, 'Default width.');
  t.equal(obj.height, 200, 'Default height.');
  t.equal(obj.gravity.x, 10, 'Default gravity x.');
  t.equal(obj.gravity.y, 20, 'Default gravity y.');
  t.equal(obj.c, 10, 'Default c.');
  t.equal(obj.pauseStep, true, 'Default pauseStep.');
  t.equal(obj.pauseDraw, true, 'Default pauseDraw.');
  t.end();
});

test('add() should add an item to the world view.', function(t) {
  var view = document.createElement('div');
  view.style.position = 'absolute';
  view.style.top = '0';
  view.style.left = '0';
  view.style.width = '100px';
  view.style.height = '100px';
  document.body.innerHTML = '';
  document.body.appendChild(view);
  obj = new World(view);
  var item = document.createElement('div');
  item.className = 'item';
  obj.add(item);
  t.equal(document.querySelectorAll('.item').length, 1, 'document.body contain a DOM element with className "item"');
  t.end();
});




