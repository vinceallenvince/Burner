describe("PubSub", function() {

  var getDataType, system, pubsub, Anim = {};

  var goodbye = 'goodbye', hello = function() { goodbye = 'hello'; };

  beforeEach(function() {

    (function(exports) {

      // create world element
      var world = document.createElement('div');
      world.id = 'worldA';
      world.className = 'world';
      document.body.appendChild(world);

      // create world element
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
    pubsub = Anim.Burner.PubSub;
    system.create(null, document.getElementById('worldA'));
  });

  afterEach(function() {
    system._destroySystem();
  });

  it("should have a method subscribe() that saves callbacks.", function() {
    pubsub.subscribe('hello', hello);
    expect(getDataType(pubsub._callbacks.hello)).toEqual('array');
  });

  it("should have a method publish() that executes callbacks.", function() {
    pubsub.subscribe('hello', hello);
    var msg = pubsub.publish('hello');
    expect(goodbye).toEqual('hello');
  });

});