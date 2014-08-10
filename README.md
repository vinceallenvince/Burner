#Burner: A rendering engine for DOM-based animation.

Use Burner to setup a rendering system in your web browser using only DOM elements. The system supplies some convenient functions for controlling playback and optimizing object management via object pooling.

Burner includes a basic Item class. You will typically supply a set of classes like <a href='http://github.com/foldi/FloraJS'>FloraJS</a> that inherits from the Item class.

Start by creating a new Burner system. Next, save instances of these classes to the system and let Burner handle updating the DOM.

## Using your own classes

Here's an example of how to use your own classes with Burner. Below we've added a new Obj class to a singleton called 'Hello'. There are some minimum requirements:

* It must extend the Burner.Item class via Burner.System.extend. (ie. Burner.System.extend(Obj, Burner.Item))
* It must call Burner.Item in its constructor. (ie. Burner.Item.call(this))

You can also override the default step() function to update your object's properties. Set Burner's 'Classes' property to the singleton. Call setup() and pass a function that adds an instance of your class. Finally, call loop().

```html

<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
  <meta name="keywords" content="" />
  <meta name="description" content="" />
  <meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1.0, maximum-scale=1.0" />
  <meta name='apple-mobile-web-app-capable' content='yes' />
  <title>Burner Custom Classes</title>
  <link rel="stylesheet" href="css/Burner.min.css" type="text/css" charset="utf-8" />
  <script src="scripts/Burner.min.js" type="text/javascript" charset="utf-8"></script>
  </head>
  <body>
    <script type="text/javascript" charset="utf-8">

      /**
       * Holds new classes for Burner.
       */
      var Hello = {};

      /**
       * Creates a new Obj.
       *
       * @param {Object} [opt_options=] A map of initial properties.
       * @constructor
       */
      function Obj(opt_options) {
        Burner.Item.call(this);
        var options = opt_options || {};
        this.width = options.width || 100;
        this.height = options.height || 100;
      }
      Burner.Utils.extend(Obj, Burner.Item);

      // Uncomment to provide your own step function.
      /*Obj.prototype.step = function() {
        // your code to update this obj goes here
      };*/

      Hello.Obj = Obj;

      /**
       * Tell Burner where to find classes.
       */
      Burner.Classes = Hello;

      /**
       * Create a new Burner system.
       */
      Burner.System.setup(function() {
        this.add('Obj'); // add your new object to the system
      });
      Burner.System.loop();
    </script>
  </body>
</html>

```

Running the code, you should see a black box fall to the ground. If you inspect the HTML, you'll notice the box has a class called 'obj'. You can use this class to further manipulate this object via css.

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
npm install -g coverify
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

