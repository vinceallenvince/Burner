/*global Burner */
/*jshint supernew:true */
var exports = {};

describe("World", function() {

  var obj, getDataType, system, records, Anim = {};

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

        var options = opt_options || {};

        options.name = 'Mover';

        exports.Burner.Element.call(this, options);

        this.options = options;
        this.world = options.world;
        this.mass = options.mass || 10;

        return this;
      }
      exports.Burner.Utils.extend(Mover, exports.Burner.Element);

      exports.Mover = Mover;

    }(Anim));
    getDataType = Anim.Burner.Utils.getDataType;
    system = Anim.Burner.System;
    utils =  Anim.Burner.Utils;
    records = system.create(null, document.getElementById('worldA'));
    obj = records[0];
  });

  afterEach(function() {
    system._destroySystem();
    obj = null;
  });

  it("should create worlds.", function() {
    expect(obj.bounds[0]).toEqual(0);
    expect(obj.bounds[3]).toEqual(0);
    expect(utils.getDataType(obj._pool)).toEqual('array');
  });

  it("should have a method _getBounds() to set world boundaries.", function() {
    var width = obj.el.offsetWidth, height = obj.el.offsetHeight;
    expect(obj._getBounds()).toEqual([0, width, height, 0]);
  });

  it("should have a method update() to update properties.", function() {
    Anim.Burner.World.update({
        gravity: {x: 0, y: 1},
        c: 0.1
      });
    expect(obj.gravity.y).toEqual(1);
    expect(obj.c).toEqual(0.1);
  });

  it("should have a method _applyStyles() to loop thru the world's style property and set styles on its associated DOM element.", function() {
    Anim.Burner.World.update({
        gravity: {x: 0, y: 1},
        c: 0.1,
        style: {
          backgroundColor: 'rgb(255, 0, 0)'
        }
      });
    expect(Anim.Burner.System.allWorlds()[0].el.style.backgroundColor).toEqual('rgb(255, 0, 0)');

  });
});