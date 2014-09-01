var test = require('tape'),
    Item = require('../src/Item'),
    Vector = require('vector2d-lib'),
    Utils = require('drawing-utils-lib'),
    World, obj;

test('load World.', function(t) {
  World = require('../src/World');
  t.ok(World, 'object loaded');
  t.end();
});

test('new Item() should create a new Item and add its view to the DOM.', function(t) {
  var obj = new World();
  t.equal(obj.el, document.body, 'should by default use document.body as a view.');
  t.equal(obj.name, 'World', 'should have a name.');

  var view  = document.createElement('div');
  var obj = new World({el: view});
  t.equal(obj.el, view, 'can pass a DOM element as a view.');
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
  obj = new World({el: view});
  obj.init();
  t.assert(obj.color[0] === 0 && obj.color[1] === 0 && obj.color[2] === 0, 'Default color.');
  t.equal(obj.width, 100, 'Default width.');
  t.equal(obj.height, 100, 'Default height.');
  t.equal(obj.borderWidth, 0, 'Default borderWidth.');
  t.equal(obj.borderStyle, 'none', 'Default borderStyle.');
  t.assert(obj.borderColor[0] === 0 && obj.borderColor[1] === 0 && obj.borderColor[2] === 0, 'Default borderColor.');
  t.equal(obj.gravity.x, 0, 'Default gravity x.');
  t.equal(obj.gravity.y, 1, 'Default gravity y.');
  t.equal(obj.c, 0.1, 'Default c.');
  t.equal(obj.pauseStep, false, 'Default pauseStep.');
  t.equal(obj.pauseDraw, false, 'Default pauseDraw.');
  t.equal(obj.el.className, 'world', 'Should have className based on name.');
  // t.ok(obj.location.x, 'Default location x.'); // TODO: fix
  // t.ok(obj.location.y, 'Default location y.');
  t.end();
});

test('init() should initialize with custom properties.', function(t) {
  var view = document.createElement('div');
  view.style.position = 'absolute';
  view.style.width = '100px';
  view.style.height = '100px';
  document.body.appendChild(view);
  obj = new World(view);
  obj.init({}, {
    width: 200,
    height: 200,
    color: [200, 0, 0],
    borderWidth: 10,
    borderStyle: 'dotted',
    borderColor: [0, 0, 200],
    gravity: new Vector(10, 20),
    c: 10,
    pauseStep: true,
    pauseDraw: true,
    location: new Vector(50, 50)
  });
  t.assert(obj.color[0] === 200 && obj.color[1] === 0 && obj.color[2] === 0, 'Custom color.');
  t.equal(obj.width, 200, 'Custom width.');
  t.equal(obj.height, 200, 'Custom height.');
  t.equal(obj.borderWidth, 10, 'Default borderWidth.');
  t.equal(obj.borderStyle, 'dotted', 'Default borderStyle.');
  t.assert(obj.borderColor[0] === 0 && obj.borderColor[1] === 0 && obj.borderColor[2] === 200, 'Custom borderColor.');
  t.equal(obj.gravity.x, 10, 'Custom gravity x.');
  t.equal(obj.gravity.y, 20, 'Custom gravity y.');
  t.equal(obj.c, 10, 'Custom c.');
  t.equal(obj.pauseStep, true, 'Custom pauseStep.');
  t.equal(obj.pauseDraw, true, 'Custom pauseDraw.');
  t.equal(obj.location.x, 50, 'Custom location x.');
  t.equal(obj.location.y, 50, 'Custom location y.');
  t.end();
});

test('add() should add an item to the world view.', function(t) {
  var view = document.createElement('div');
  view.style.position = 'absolute';
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




