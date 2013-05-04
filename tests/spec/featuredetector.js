describe("A new FeatureDetector", function() {

  var getDataType, system, Anim = {};

  beforeEach(function() {

    (function(exports) {

      // create world element
      var world = document.createElement('div');
      world.id = 'worldA';
      world.className = 'world';
      document.body.appendChild(world);

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
    obj = Anim.Burner.FeatureDetector;
  });

  afterEach(function() {
    system._destroySystem();
  });

  it("should have a method detect() that returns true if feature is detected, false if not.", function() {
    expect(getDataType(obj.detect('csstransforms'))).toEqual('boolean');
    expect(getDataType(obj.detect('csstransforms3d'))).toEqual('boolean');
    expect(getDataType(obj.detect('touch'))).toEqual('boolean');
  });
});