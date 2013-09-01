describe("A System", function() {

  var system = Burner.System, el, world;

  beforeEach(function() {
    el = document.createElement('div');
    el.id = 'world';
    document.body.appendChild(el);
    world = new Burner.World(document.getElementById('world'));
    Burner.System.init(function() {}, world);
  });

  afterEach(function() {
    system._destroySystem();
  });

  it("should have its required properties.", function() {
    expect(system.name).toEqual('System');
    expect(system.clock).toEqual(1);
    expect(typeof system.supportedFeatures).toEqual('object');
    expect(typeof system.supportedFeatures.csstransforms).toEqual('boolean');
    expect(typeof system.supportedFeatures.csstransforms3d).toEqual('boolean');
    expect(typeof system._records).toEqual('object');
    expect(typeof system._records.list).toEqual('object');
    expect(typeof system._records.lookup).toEqual('object');
    expect(system._records.list.length).toEqual(1);
    expect(system._idCount).toEqual(1);
    expect(typeof system.mouse).toEqual('object');
    expect(system.mouse.location instanceof exports.Vector).toEqual(true);
    expect(system.mouse.lastLocation instanceof exports.Vector).toEqual(true);
    expect(system.mouse.velocity instanceof exports.Vector).toEqual(true);
    expect(system._resizeTime).toEqual(0);
  });

  it("should have a method init() that initializes the system and starts the update loop.", function() {
    expect(system._records.list.length).toEqual(1);
    expect(typeof system.supportedFeatures).toEqual('object');
    expect(typeof system.supportedFeatures.csstransforms).toEqual('boolean');
    expect(typeof system.supportedFeatures.csstransforms3d).toEqual('boolean');
  });

  it("should have a method add() that adds an object to the system.", function() {

  });

  it("should have a method count() that returns the total number of items in the system.", function() {

  });

  it("should have a method firstWorld() that returns the first world in the system.", function() {

  });

  it("should have a method lastWorld() that returns the last world in the system.", function() {

  });

  it("should have a method firstItem() that returns the first item in the system.", function() {

  });

  it("should have a method lastItem() that returns the last item in the system.", function() {

  });

  it("should have a private method _update() that iterates over objects in the system and calls step() and draw().", function() {
    system._update();
    expect(system.clock).toEqual(2);
  });

  it("should have a private method _stepForward() that pauses the system and processes one step in records.", function() {

  });

  it("should have a private method _resetSystem() that resets the system.", function() {

  });

  it("should have a private method _destroyAllItems() that removes all elements in all worlds.", function() {

  });

  it("should have a private method _resize() that repositions all elements relative to the window size and resets the world bounds.", function() {

  });

  it("should have a private method _keyup() that handles keyup events.", function() {

  });

  it("should have a method getNewId() that increments idCount and returns the value.", function() {
    system.getNewId();
    expect(system._idCount).toEqual(2);
  });

  it("should have a private method _addEvent() that adds an event listener to a DOM element.", function() {

  });

  it("should have a private method _recordMouseLoc() that saves the mouse/touch location relative to the browser window.", function() {

  });

  it("should have a method extend() that extends the properties and methods of a superClass onto a subClass.", function() {
    var superClass = function() {
      this.hello = 'hello';
    };
    superClass.prototype.sayHi = function() {return 'hi';};
    var SubClass = function() {
      superClass.call(this);
    };
    system.extend(SubClass, superClass);
    var sub = new SubClass();
    expect(sub.hello).toEqual('hello');
    expect(sub.sayHi()).toEqual('hi');
  });

  it("should have a static method getWindowSize() that determines the size of the browser window.", function() {
    expect(typeof system.getWindowSize()).toEqual('object');
    expect(typeof system.getWindowSize().width).toEqual('number');
    expect(typeof system.getWindowSize().height).toEqual('number');
  });

  it("should have a method updateOrientation() that handles orientation evenst and forces the world to update its bounds.", function() {

  });

  it("getRandomNumber() should return a random number within a range.", function() {
    expect(typeof(system.getRandomNumber(1, 100))).toEqual('number');
    expect(system.getRandomNumber(1, 100)).toBeGreaterThan(0);
    expect(system.getRandomNumber(1, 100)).toBeLessThan(101);
  });
  it("getRandomNumber() should return a float when passing 'true' as 3rd argument.", function() {
    expect(system.getRandomNumber(1, 100, true) % 1).toNotEqual(0);
  });
  it("getRandomNumber() should return an integer when passing 'false' as 3rd argument.", function() {
    expect(system.getRandomNumber(1, 100, false) % 1).toEqual(0);
  });

  it("should have a private method _toggleStats() that toggles stats display.", function() {

  });

  it("should have a method getCSSText() that concatenates a new cssText string.", function() {

  });

});
