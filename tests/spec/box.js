describe("A Box", function() {

  var obj;

  beforeEach(function() {
    el = document.createElement('div');
    el.id = 'world';
    document.body.appendChild(el);
    obj = new SimpleSim.Box({
      world: new SimpleSim.World(el)
    });
  });

  afterEach(function() {
    document.body.removeChild(document.getElementById('world'));
  });

  it("should have its required properties.", function() {
    expect(obj.name).toEqual('Box');
  });


  it("should have a method step() that should update the object's properties.", function() {

  });

  it("should have a private method _applyForce() that adds a force to this object's acceleration.", function() {

  });

  it("should have a private method _checkWorldEdges() that determines if this object is outside the world bounds.", function() {

  });

  it("should have a method draw() that updates the corresponding DOM element's style property.", function() {

  });

  it("should have a method _getCSSText() that concatenates a new cssText string.", function() {

  });
});
