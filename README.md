![Build status](https://travis-ci.org/vinceallenvince/Burner.svg?branch=master)

#Burner: A rendering engine for DOM-based animation.

Use Burner to setup a DOM-based rendering system in a web browser. Burner supplies some convenient functions for controlling playback, controlling the camera, detecting world boundaries, and optimizing object management via object pooling.

##Install

To include Burner as a component in your project, use the node module.

```
npm install burner --save
```

You can also use the [standalone version](https://github.com/vinceallenvince/Burner/releases/latest) and reference both the css and js files from your document.

```
<html>
  <head>
    <link href="css/burner.min.css" type="text/css" charset="utf-8" rel="stylesheet" />
    <script src="scripts/burner.js" type="text/javascript" charset="utf-8"></script>
  </head>
  ...
```

##Usage

Burner contains the essential classes for creating a rendering engine... [System](https://github.com/vinceallenvince/Burner/blob/master/src/System.js), [World](https://github.com/vinceallenvince/Burner/blob/master/src/World.js) and [Item](https://github.com/vinceallenvince/Burner/blob/master/src/Item.js). You can use these built-in classes to create [simple systems](http://vinceallenvince.github.io/Burner).

```
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="css/burner.min.css" type="text/css" charset="utf-8" />
  <script src="scripts/burner.js" type="text/javascript" charset="utf-8"></script>
  </head>
  <body>
    <script type="text/javascript" charset="utf-8">
      Burner.System.setup(function() {
        this.add('World');
        this.add('Obj');
      });
      Burner.System.loop();
    </script>
  </body>
</html>
```

## Using your own classes

To create something more complex, you need supply a library of classes like <a href='http://github.com/foldi/FloraJS'>FloraJS</a> that inherit from the Item class.

Start by creating a new Burner system. Next, save instances of these classes to the system and let Burner handle updating the DOM.

A class must meet some minimum requirements:

* It must extend the Burner.Item class via Burner.Utils.extend. (ie. Burner.Utils.extend(Obj, Burner.Item))
* It must call Burner.Item in its constructor. (ie. Burner.Item.call(this))

You must add an entry for your class in Burner's 'Classes' map. Call setup() and pass a function that adds an instance of your class. Finally, call loop().

```html

<!DOCTYPE html>
<html>
<head>
  <title>Burner | Custom classes</title>
  <link rel="stylesheet" href="css/Burner.min.css" type="text/css" charset="utf-8" />
  <script src="scripts/Burner.min.js" type="text/javascript" charset="utf-8"></script>
  </head>
  <body>
    <script type="text/javascript" charset="utf-8">

      /**
       * Creates a new Obj.
       *
       * @param {Object} [opt_options=] A map of initial properties.
       * @constructor
       */
      function Obj(opt_options) {
        Burner.Item.call(this);
        this.name = 'obj';
      }
      Burner.Utils.extend(Obj, Burner.Item);

      // Uncomment to provide your own step function.
      /*Obj.prototype.step = function() {
        // your code to update this obj every frame goes here
      };*/

      /**
       * Tell Burner where to find classes.
       */
      Burner.System.Classes = {
        Obj: Obj
      };

      /**
       * Create a new Burner system.
       */
      Burner.System.setup(function() {
        this.add('World', {
          color: [200, 200, 200]
        });
        this.add('Obj', {
          color: [0, 0, 0]
        });
      });
      Burner.System.loop();
    </script>
  </body>
</html>

```

Running the code, you should see a black box fall to the ground. The [Item](https://github.com/vinceallenvince/Burner/blob/master/src/Item.js) class has a default step() function that runs a gravity simulation.

You can override the default step() function to control your object's behavior any way you want.

Building this project
------

This project uses [Grunt](http://gruntjs.com). To build the project first install the node modules.

```
npm install
```

Next, run grunt.

```
grunt
```

To run the tests, install the following packages and run 'npm test'.

```
npm install -g browserify
npm install -g testling
npm test
```

A pre-commit hook is defined in /pre-commit that runs jshint. To use the hook, run the following:

```
ln -s ../../pre-commit .git/hooks/pre-commit
```

A post-commit hook is defined in /post-commit that runs the Plato complexity analysis tools. To use the hook, run the following:

```
ln -s ../../post-commit .git/hooks/post-commit
```

