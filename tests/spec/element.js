describe("A new Element", function() {

  var getDataType, system, Anim = {};

  beforeEach(function() {

    (function(exports) {

      // create world element
      var world = document.createElement('div');
      world.id = 'worldA';
      world.className = 'world';
      document.body.appendChild(world);

      // create element
      var element = document.createElement('div');
      element.id = 'element';
      element.className = 'element';
      document.body.appendChild(element);

      // create Burner namespace
      exports.Burner = {};

      // pass in the namespace and parent object
      new Burner(exports.Burner, exports);

      function Mover(opt_options) {

        var options = opt_options || {}, myDiv;

        options.name = 'Mover';

        exports.Burner.Element.call(this, options);

        this.options = options;
        this.world = options.world;
        this.mass = options.mass || 10;

        myDiv = document.createElement("div");
        myDiv.id = this.id;
        myDiv.className = this.name;
        myDiv.style.visibility = 'hidden';
        this.el = this.options.world.el.appendChild(myDiv);

      }
      exports.Burner.Utils.extend(Mover, exports.Burner.Element);

      exports.Mover = Mover;

    }(Anim));
    getDataType = Anim.Burner.Utils.getDataType;
    system = Anim.Burner.System;
    system.create(null, document.getElementById('worldA'));
    obj = new Anim.Burner.Element({
      world: document.getElementById('worldA'),
      mass: 100,
      tagline: 'Hello Sparky!',
      el: document.getElementById('element'),
      location: {x: 100, y: 100},
      width: 100,
      height: 100,
      color: [0, 0, 0],
      visibility: 'visible'
    });
  });

  afterEach(function() {
    system._destroySystem();
    if (document.getElementById('element')) {
      document.body.removeChild(document.getElementById('element'));
    }
  });

  it("should have its required properties.", function() {
    expect(getDataType(obj.name)).toEqual('string');
    expect(getDataType(obj.id)).toEqual('string');
    expect(getDataType(obj.options)).toEqual('object');
  });

  it("should have a method _init() that assigns all options to properties.", function() {
    obj._init();
    expect(obj.mass).toEqual(100);
    expect(obj.tagline).toEqual('Hello Sparky!');
  });

  it("should have a method draw() that updates the corresponding DOM element's style property.", function() {
    obj._init();
    var cssText = obj.draw();
    expect(getDataType(cssText)).toEqual('string');
  });

  it("should have a method getCSSText() that concatenates a new cssText string based on passed properties.", function() {

    var cssText = obj._getCSSText({
      x: 100,
      y: 50,
      width: 20,
      height: 20,
      visibility: 'visible'
    });
    expect(cssText).toEqual('-webkit-transform: translate3d(100px, 50px, 0);-moz-transform: translate3d(100px, 50px, 0);-o-transform: translate3d(100px, 50px, 0);-ms-transform: translate3d(100px, 50px, 0);width: 20px;height: 20px;background-color: transparent;visibility: visible');
  });
});