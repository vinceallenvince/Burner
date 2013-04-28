#Burner: A rendering engine for DOM-based animation.

Use Burner to setup a rendering system in your web browser using only DOM elements. The system optimizes object management via object pooling. It also supplies some convenient functions for controlling playback, handling resizing, and monitoring mouse or touch events.

By itself, Burner doesn't do anything. You need to supply a set of classes like <a href='http://github.com/foldi/FloraJS'>FloraJS</a>. You start by creating a new Burner system. Next, save instances of these classes to the system and let Burner handle updating the DOM.

Check out the project in the <a href='http://github.com/foldi/Burner/tree/master/dev'>dev folder</a> for an example.