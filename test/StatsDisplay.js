var test = require('tape'),
    Item = require('../src/Item').Item,
    Vector = require('../src/Vector').Vector,
    Utils = require('../src/Utils').Utils,
    StatsDisplay, obj;

test('load StatsDisplay.', function(t) {
  StatsDisplay = require('../src/StatsDisplay').StatsDisplay;
  t.ok(StatsDisplay, 'object loaded');
  t.end();
});

test('check static properties.', function(t) {
  t.equal(StatsDisplay.name, 'StatsDisplay', 'should have a name.');
  t.equal(StatsDisplay.active, false, 'active = false.');
  t.equal(StatsDisplay.fps, false, 'fps = false.');
  t.ok(StatsDisplay._time, 'has a _time property.');
  t.ok(StatsDisplay._timeLastFrame, 'has a _timeLastFrame.');
  t.ok(StatsDisplay._timeLastSecond, 'has a _timeLastSecond.');
  t.equal(StatsDisplay._frameCount, 0, '_frameCount = 1.');
  t.end();
});

test('init() should initialize the StatsDisplay.', function(t) {
  document.body.innerHTML = '';
  StatsDisplay.init();
  t.equal(typeof StatsDisplay.el, 'object', 'el is a DOM element.');
  t.equal(StatsDisplay.el.id, 'statsDisplay', 'el id = statsDisplay.');
  t.equal(StatsDisplay.el.className, 'statsDisplay', 'el className = statsDisplay.');
  t.ok(StatsDisplay.totalElementsValue, 'should have a _totalElementsValue property.');
  t.ok(StatsDisplay.fpsValue, 'should have a _fpsValue property.');
  t.equal(document.querySelectorAll('.statsDisplay').length, 1, 'should append a view.');
  t.end();
});

test('hide() should hide the StatsDisplay.', function(t) {
  document.body.innerHTML = '';
  StatsDisplay.init();
  StatsDisplay.hide();
  var view = document.querySelectorAll('.statsDisplay')[0];
  t.equal(view.style.display, 'none', 'should hide the view.');
  t.end();
});

test('show() should show the StatsDisplay.', function(t) {
  document.body.innerHTML = '';
  StatsDisplay.init();
  StatsDisplay.hide();
  StatsDisplay.show();
  var view = document.querySelectorAll('.statsDisplay')[0];
  t.equal(view.style.display, 'block', 'should show the view.');
  t.end();
});

test('update() should update fps every second.', function(t) {
  t.plan(3);
  document.body.innerHTML = '';
  StatsDisplay.init();
  StatsDisplay._timeLastSecond = Date.now();
  StatsDisplay.update(10);
  StatsDisplay.update(11);
  StatsDisplay.update(21);
  setTimeout(function() {
    StatsDisplay.update(18);
    t.equal(StatsDisplay.fps, 4, 'fps should increment.');
    var view = document.querySelectorAll('.statsDisplay')[0];
    t.equal(StatsDisplay.fpsValue.textContent, '4', 'fps field should display fps value');
    t.equal(StatsDisplay.totalElementsValue.textContent, '18', 'totalElements field should display totalElementsValue value');
  }, 1001)
});
