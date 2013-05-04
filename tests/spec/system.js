/*global document, Burner */
var exports = {};

describe("System", function() {

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
  });

  afterEach(function() {
    system._destroySystem();
  });

  it("should have a method create() that initializes the system by saving references to the " +
      "system worlds and running a setup script if passed.", function() {

    var system = Anim.Burner.System,
        records = system.create(null, document.getElementById('worldA'));

    expect(getDataType(records)).toEqual('array');
    expect(records.length).toEqual(1);
    expect(getDataType(system._records.lookup)).toEqual('object');
    expect(getDataType(system._records.list)).toEqual('array');
    expect(getDataType(system._worldsCache.lookup)).toEqual('object');
    expect(getDataType(system._worldsCache.list)).toEqual('array');
    expect(getDataType(system.mouse)).toEqual('object');
    expect(getDataType(system.mouse.location)).toEqual('object');
    expect(getDataType(system.mouse.location.x)).toEqual('number');
    expect(getDataType(system.mouse.location.y)).toEqual('number');
    expect(getDataType(system.mouse.lastLocation)).toEqual('object');
    expect(getDataType(system.mouse.lastLocation.x)).toEqual('number');
    expect(getDataType(system.mouse.lastLocation.y)).toEqual('number');
    expect(getDataType(system.mouse.velocity)).toEqual('object');
    expect(getDataType(system.mouse.velocity.x)).toEqual('number');
    expect(getDataType(system.mouse.velocity.y)).toEqual('number');
  });

  it("should have a method _getIdCount() to get the current id count.", function() {
    system.create(null, document.getElementById('worldA'));
    expect(system._getIdCount()).toEqual(1);
  });

  it("should have a method _getNewId() to get a new id.", function() {
    system.create(null, document.getElementById('worldA'));
    expect(system._getNewId()).toEqual(2);
  });

  it("should have a method getWorld() to get a reference to a world in the _records.list array.", function() {
    system.create(null, document.getElementById('worldA'));
    expect(system.getWorld(document.getElementById('worldA'))).toEqual(system._records.list[0]);
    expect(system.getWorld(document.getElementById('worldA'))).toEqual(system._worldsCache.list[0]);
  });

  it("should have a method allWorlds() to return all worlds.", function() {
    system.create(null, document.getElementById('worldA'));
    expect(getDataType(system.allWorlds())).toEqual('array');
    expect(system.allWorlds().length).toEqual(1);
  });

  it("should have a method hasWorld() that checks if world exists.", function() {
    system.create(null, document.getElementById('worldA'));
    var world = system.allWorlds()[0];
    expect(system.hasWorld(world.id)).toEqual(true);
  });

  it("should have a method updateCache() that adds an object to a cache based on its constructor name.", function() {
    system.create(null, document.getElementById('worldA'));
    system.add('Mover', {mass: 100});
    Anim.Burner.PubSub.publish('UpdateCache', system.lastElement());
    expect(getDataType(system._Caches.Mover)).toEqual('object');
    expect(system._Caches.Mover.lookup.Mover2).toEqual(true);
    expect(system._Caches.Mover.list[0].id).toEqual('Mover2');
  });

  it("should have a private method _updateCacheLookup() that assigns the given 'val' to the given object's record in System._Caches.", function() {
    system.create(null, document.getElementById('worldA'));
    system.add('Mover', {mass: 100});
    Anim.Burner.PubSub.publish('UpdateCache', system.lastElement());
    expect(getDataType(system._Caches.Mover)).toEqual('object');
    expect(system._Caches.Mover.lookup.Mover2).toEqual(true);
    expect(system._Caches.Mover.list[0].id).toEqual('Mover2');

    system._updateCacheLookup(system._Caches.Mover.list[0], false);
    expect(system._Caches.Mover.lookup.Mover2).toEqual(false);
  });

  it("should have a method add() to add an element to a world", function() {
    system.create(null, document.getElementById('worldA'));
    system.add('Mover', {mass: 100});
    system.add('Mover', {mass: 100});
    system.add('Mover', {mass: 100});
    expect(system._records.list.length).toEqual(4);
  });

  it("should have a method destroyElement() to remove an element from a world.", function() {
    system.create(null, document.getElementById('worldA'));
    system.add('Mover', {mass: 100});
    system.add('Mover', {mass: 100});
    system.add('Mover', {mass: 100});

    var a = system.lastElement();
    system.destroyElement(a);
    expect(system.count()).toEqual(3);
  });

  it("should have a method destroyAllElements() to remove all elements from all worlds.", function() {
    system.create(null, document.getElementById('worldA'));
    system.add('Mover', {mass: 100});
    system.add('Mover', {mass: 100});
    system.add('Mover', {mass: 100});

    Anim.Burner.PubSub.publish('destroyAllElements');
    expect(system.count()).toEqual(1); // _records still has a reference to one world
  });

  it("should have a method count() to returns the total number of elements.", function() {
    system.create(null, document.getElementById('worldA'));
    system.add('Mover', {mass: 100});
    system.add('Mover', {mass: 100});
    expect(system.count()).toEqual(3);
  });

  it("should have a method hasElement() that checks if system has an element.", function() {
    system.create(null, document.getElementById('worldA'));
    system.add('Mover', {mass: 100});
    system.add('Mover', {mass: 100});
    system.add('Mover', {mass: 100});
    system.add('Mover', {mass: 100});
    system.add('Mover', {mass: 100});
    system.add('Mover', {mass: 100});
    var element = system.lastElement();
    expect(system.hasElement(element.id)).toNotEqual(undefined);
  });

  it("should have a method allElements() to returns all elements in the system.", function() {
    system.create(null, document.getElementById('worldA'));
    system.add('Mover', {mass: 100});
    system.add('Mover', {mass: 100});
    system.add('Mover', {mass: 100});
    system.add('Mover', {mass: 100});
    system.add('Mover', {mass: 100});
    system.add('Mover', {mass: 100});
    expect(system.allElements().length).toEqual(7);
  });

  it("should have a method firstElement() to returns the first element in the system.", function() {
    system.create(null, document.getElementById('worldA'));
    system.add('Mover', {mass: 100});
    system.add('Mover', {mass: 100});
    system.add('Mover', {mass: 100});
    expect(getDataType(system.firstElement())).toEqual('object');
    expect(system._records.list[0].id).toEqual(system.firstElement().id);
  });

  it("should have a method lastElement() to returns the last element in the system.", function() {
    system.create(null, document.getElementById('worldA'));
    system.add('Mover', {mass: 100});
    system.add('Mover', {mass: 100});
    system.add('Mover', {mass: 100});
    expect(getDataType(system.lastElement())).toEqual('object');
    expect(system._records.list[system._records.list.length - 1].id).toEqual(system.lastElement().id);
  });

  it("should have a method getAllElementsByName() to return an array of elements created from the same constructor.", function() {
    system.create(null, document.getElementById('worldA'));
    system.add('Mover', {mass: 100});
    system.add('Mover', {mass: 100});
    system.add('Mover', {mass: 100});
    expect(getDataType(system.getAllElementsByName('Mover'))).toEqual('array');
    expect(system.getAllElementsByName('Mover').length).toEqual(3);
    system.destroyElement(system.getAllElementsByName('Mover')[0]);
    expect(system.getAllElementsByName('Mover').length).toEqual(2);
    expect(system.getAllElementsByName('Mover', system.allWorlds()[0]._pool).length).toEqual(1);
  });

  it("should have a method getAllElementsByAttribute() to return an array of elements with an attribute that matches the passed 'attr'.", function() {
    system.create(null, document.getElementById('worldA'));
    system.add('Mover', {mass: 100});
    system.add('Mover', {mass: 200});
    system.add('Mover', {mass: 100});
    expect(getDataType(system.getAllElementsByAttribute('mass'))).toEqual('array');
    expect(system.getAllElementsByAttribute('mass').length).toEqual(3);
    expect(system.getAllElementsByAttribute('mass', 200).length).toEqual(1);
  });

  it("should have a method updateElementPropsByName() to update the properties of elements created from the same constructor.", function() {
    system.create(null, document.getElementById('worldA'));
    system.add('Mover', {mass: 100});
    system.add('Mover', {mass: 200});
    system.add('Mover', {mass: 100});
    expect(getDataType(system.updateElementPropsByName('Mover', {mass: 300}))).toEqual('array');
    expect(system.updateElementPropsByName('Mover', {mass: 300}).length).toEqual(3);
    expect(system.updateElementPropsByName('Mover', {mass: 300})[0].mass).toEqual(300);
  });

  it("should have a method getElement() to find an element by its 'id' and returns it.", function() {
    system.create(null, document.getElementById('worldA'));
    system.add('Mover', {mass: 100});
    system.add('Mover', {mass: 200});
    system.add('Mover', {mass: 100});

    var a = system.getAllElementsByName('Mover');

    expect(system.getElement(a[0].id).id).toEqual(a[0].id);
    expect(system.getElement('hello')).toEqual(null);
  });

  it("should have a method updateElement() to update the properties of an element.", function() {
    system.create(null, document.getElementById('worldA'));
    system.add('Mover', {mass: 100});
    system.add('Mover', {mass: 200});
    system.add('Mover', {mass: 100});

    var a = system.getAllElementsByName('Mover');

    expect(system.updateElement(a[0], {mass: 300}).mass).toEqual(300);
  });

  it("should have a method _pause() to pause updates to a world.", function() {
    system.create(null, document.getElementById('worldA'));
    system.add('Mover', {mass: 100});
    system.add('Mover', {mass: 200});
    system.add('Mover', {mass: 100});

    var world = system.allWorlds()[0];
    expect(world.pauseStep).toEqual(false);
    expect(world.pauseDraw).toEqual(false);

    system._pause();

    expect(world.pauseStep).toEqual(true);
    expect(world.pauseDraw).toEqual(true);
  });

  it("should have a method _resetSystem() that resets the system.", function() {
    system.create(null, document.getElementById('worldA'));
    system.add('Mover', {mass: 100});
    system.add('Mover', {mass: 200});
    system.add('Mover', {mass: 100});

    expect(system.count()).toEqual(4);

    system._resetSystem();

    // should remove all elements but preserve world
    expect(system.count()).toEqual(1);
    // idCount = 4 because we do not reset idCount on reset.
    expect(system._getIdCount()).toEqual(4);
  });

  it("should have a method _destroySystem() that resets the system and removes all worlds and elements.", function() {
    system.create(null, document.getElementById('worldA'));
    system.add('Mover', {mass: 100});
    system.add('Mover', {mass: 200});
    system.add('Mover', {mass: 100});

    expect(system.count()).toEqual(4);

    system._destroySystem();

    // should remove all elements but preserve world
    expect(system.count()).toEqual(0);
    // idCount = 4 because we do not reset idCount on reset.
    expect(system._getIdCount()).toEqual(0);
  });
});
