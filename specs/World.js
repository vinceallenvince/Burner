describe("A World", function() {

  var obj;

  beforeEach(function() {
    el = document.createElement('div');
    el.id = 'world';
    document.body.appendChild(el);
    obj = new Burner.World(el);
  });

  afterEach(function() {
    document.body.removeChild(document.getElementById('world'));
  });

  it("should have its required properties.", function() {
    expect(typeof obj.el).toEqual('object');
    expect(obj.name).toEqual('World');
    expect(typeof obj.id).toEqual('string');
    expect(typeof obj.width).toEqual('number');
    expect(typeof obj.height).toEqual('number');
    expect(typeof obj.angle).toEqual('number');
    expect(typeof obj.color).toEqual('string');
    expect(typeof obj.colorMode).toEqual('string');
    expect(typeof obj.visibility).toEqual('string');
    expect(typeof obj.opacity).toEqual('number');
    expect(typeof obj.borderWidth).toEqual('number');
    expect(typeof obj.borderStyle).toEqual('string');
    expect(typeof obj.borderColor).toEqual('string');
    expect(typeof obj.boxShadowOffset).toEqual('object');
    expect(typeof obj.boxShadowBlur).toEqual('number');
    expect(typeof obj.boxShadowSpread).toEqual('number');
    expect(typeof obj.boxShadowColor).toEqual('string');
    expect(obj.gravity instanceof exports.Vector).toEqual(true);
    expect(typeof obj.c).toEqual('number');
    expect(obj.pauseStep).toEqual(false);
    expect(obj.pauseDraw).toEqual(false);
    expect(typeof obj._pool).toEqual('object');
    expect(typeof obj.world).toEqual('object');
  });

  it("should have a method step() that is a noop.", function() {
    expect(typeof obj.step).toEqual('function');
    expect(obj.step()).toEqual(undefined);
  });

  it("should have a method draw() that is a noop.", function() {
    expect(typeof obj.draw).toEqual('function');
    expect(obj.draw()).toEqual(undefined);
  });

  it("should have a private method _setBounds() that determines the width and height of the world.", function() {
    expect(obj.bounds[0]).toEqual(0);
    expect(typeof obj.bounds[1]).toEqual('number');
    expect(typeof obj.bounds[2]).toEqual('number');
    expect(obj.bounds[3]).toEqual(0);
    expect(typeof obj.bounds).toEqual('object');
    expect(typeof obj.width).toEqual('number');
    expect(typeof obj.height).toEqual('number');
  });

});
