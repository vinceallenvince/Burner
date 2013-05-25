describe("A Item", function() {

  var obj;

  beforeEach(function() {
    el = document.createElement('div');
    el.id = 'world';
    document.body.appendChild(el);
    obj = new SimpleSim.Item({
      world: new SimpleSim.World(el)
    });
  });

  afterEach(function() {
    document.body.removeChild(document.getElementById('world'));
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

  });

  it("should have a method step() that should update the object's properties.", function() {

  });

  it("should have a private method _applyForce() that adds a force to this object's acceleration.", function() {

  });

  it("should have a private method _checkWorldEdges() that determines if this object is outside the world bounds.", function() {

  });

  it("should have a method draw() that updates the corresponding DOM element's style property.", function() {

  });

});
