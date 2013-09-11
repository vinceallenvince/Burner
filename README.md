#Burner: A rendering engine for DOM-based animation.

Use Burner to setup a rendering system in your web browser using only DOM elements. The system supplies some convenient functions for controlling playback, handling resizing, and optimizing object management via object pooling.

By itself, Burner doesn't do anything. You need to supply a set of classes like <a href='http://github.com/foldi/FloraJS'>FloraJS</a>. You start by creating a new Burner system. Next, save instances of these classes to the system and let Burner handle updating the DOM.

## Using your own classes

Here's an example of how to use your own classes with Burner. Below I've added a new Obj class to a singleton called 'Hello'. There are some minimum requirements:

* Your new class must have an init() function.
* It must extend the Burner.Item class via Burner.System.extend. (ie. Burner.System.extend(Obj, Burner.Item))
* It must call Burner.Item in its constructor. (ie. Burner.Item.call(this, options))

You can also override the default step() function to update your object's properties. Finally, set Burner's 'Classes' property to the singleton.

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
  <link rel="stylesheet" href="css/burner.css" type="text/css" charset="utf-8" />
  <script src="scripts/burner.js" type="text/javascript" charset="utf-8"></script>
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
        var options = opt_options || {};
        options.name = 'Obj';
        Burner.Item.call(this, options);
      }
      Burner.System.extend(Obj, Burner.Item);

      /**
       * Initializes the object.
       * @param  {Object} options A map of initial properties.
       */
      Obj.prototype.init = function(options) {
        this.width = options.width === undefined ? 20 : options.width;
        this.height = options.height === undefined ? 20 : options.height;
        this.color = options.color || [100, 100, 100];
        this.borderRadius = options.borderRadius || 0;
      };

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
      Burner.System.init(function() {
        this.add('Obj'); // add your new object to the system
      });
    </script>
  </body>
</html>

```

Running the code, you should see a grey box fall to the ground. If you inspect the HTML, you'll notice the box has a class called 'obj'. You can use this class to further manipulate this object via css.

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

A pre-commit hook is defined in /pre-commit that runs jshint. To use the hook, run the following:

```
ln -s ../../pre-commit .git/hooks/pre-commit
```

A post-commit hook is defined in /post-commit that runs the Plato complexity analysis tools. To use the hook, run the following:

```
ln -s ../../post-commit .git/hooks/post-commit
```

