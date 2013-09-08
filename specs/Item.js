describe("An Item", function() {

  var obj;

  beforeEach(function() {
    el = document.createElement('div');
    el.id = 'world';
    document.body.appendChild(el);
    obj = new Item({
      world: new World(el)
    });
  });

  afterEach(function() {
    //if (document.getElementById('world')) {
      //document.body.removeChild(document.getElementById('world'));
    //}
    Burner.System._destroyAllItems();
    Burner.System._destroyAllWorlds();
    Burner.System._idCount = 0;
  });

  it("should have its required properties.", function() {
    expect(typeof obj.world).toEqual('object');
    expect(obj.name).toEqual('Item');
    expect(typeof obj.id).toEqual('string');
    expect(obj._force instanceof exports.Vector).toEqual(true);
    expect(obj._camera instanceof exports.Vector).toEqual(true);
    expect(typeof obj.el).toEqual('object');
  });

  it("should have a method reset() that resets all properties..", function() {
    obj.reset();
    expect(obj.width).toEqual(10);
    expect(obj.height).toEqual(10);
    expect(obj.color).toEqual([0, 0, 0]);
    expect(obj.colorMode).toEqual('rgb');
    expect(obj.visibility).toEqual('visible');
    expect(obj.opacity).toEqual(1);
    expect(obj.zIndex).toEqual(1);
    expect(obj.borderWidth).toEqual(0);
    expect(obj.borderStyle).toEqual('none');
    expect(obj.borderColor).toEqual('transparent');
    expect(obj.borderRadius).toEqual(0);
    expect(typeof(obj.boxShadowOffset)).toEqual('object');
    expect(obj.boxShadowBlur).toEqual(0);
    expect(obj.boxShadowSpread).toEqual(0);
    expect(obj.boxShadowColor).toEqual('transparent');
    expect(obj.bounciness).toEqual(0.8);
    expect(obj.mass).toEqual(10);
    expect(typeof(obj.acceleration)).toEqual('object');
    expect(typeof(obj.velocity)).toEqual('object');
    expect(typeof(obj.location)).toEqual('object');
    expect(obj.maxSpeed).toEqual(10);
    expect(obj.minSpeed).toEqual(0);
    expect(obj.angle).toEqual(0);
    expect(obj.lifespan).toEqual(-1);
    expect(obj.life).toEqual(0);
    expect(obj.isStatic).toEqual(false);
    expect(obj.controlCamera).toEqual(false);
    expect(obj.worldBounds).toEqual([true, true, true, true]);
    expect(obj.checkWorldEdges).toEqual(true);
    expect(obj.wrapWorldEdges).toEqual(false);
    expect(obj.avoidWorldEdges).toEqual(false);
    expect(obj.avoidWorldEdgesStrength).toEqual(50);
  });

  it("should have a method step() that should update the object's properties.", function() {
    spyOn(obj, 'applyForce');
    obj.reset();
    obj.step();
    expect(obj.applyForce).toHaveBeenCalled();
  });

  it("should have a private method applyForce() that adds a force to this object's acceleration.", function() {
    var force = new Burner.Vector(100, 100);
    obj.reset();
    var accel = obj.applyForce(force);
    expect(accel.x).toEqual(10);
    expect(accel.y).toEqual(10);
  });

  it("should have a private method _checkWorldEdges() that determines if this object is outside the world bounds.", function() {

    var world = obj.world;

    Burner.System._records.list.push(world);

    var item = Burner.System.add('Item', {
      location: function() {
        return new Burner.Vector(world.bounds[1] * 2, world.bounds[2] * 2);
      },
      init: function() {}
    });

    obj.reset();

    item._checkWorldEdges();

    expect(item.location.x <= item.world.width).toEqual(true);

    //

    world.bounds[2] = 2000;

    item = Burner.System.add('Item', {
      location: function() {
        return new Burner.Vector(this.world.bounds[3] + 100, this.world.bounds[0] + 100);
      },
      init: function() {}
    });

    item._checkWorldEdges();

    expect(item.world.width > item.location.x).toEqual(true);

  });

  it("should have a method draw() that updates the corresponding DOM element's style property.", function() {
    spyOn(Burner.System, '_draw');
    obj.draw();
    expect(Burner.System._draw).toHaveBeenCalled;
  });

});
