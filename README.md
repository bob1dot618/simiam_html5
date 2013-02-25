simiam_html5
============

Crude HTML5 version of the simiam thingy.

------------

You need to run a webserver to use this program. There is a simple
python web server in this directory, that you can use. Then, point
your browser at localhost:8000, and select 'samiam.html'.

If you feel like changing the controller algorithms, look at robot.js.
The object method named 'controller' defines the movement and redraw
of the robot. If you change that around, you can see the effects by
using 'ctrl-F5' to reload the javascript.

------------

If you are going to hack on the robot, I suggest having a javascript
console open, along with an editor on the robot.js file. Make a
change, and then flush the cache in the browser using ctrl-F5. This
should restart the simulation, and pull in all the modified files. 

I've seen situations where the changes don't get updated if there is a
problem with the javascript. It just silently uses the old javascript!
So, be aware of that. You can check the javascript by using one of the
javascript 'lint' programs on the web.

Have fun, and feel free to email me at rcmonsen@gmail.com with
suggestions. If you want to help out or fix bugs, let me know.

------------

I plan to update the code to include a state machine facility as
described in the week 5 lectures. 

statemachine object contains
 states
 current state

states contain
 list of guard objects
 f(x,u), returns the numeric time derivative of x

guard objects contain
 probe(x) function, returns priority number
 reset(x) function, returns new state x
 transition() function, transitions to new state.

Pseudocode for the 'tick()' function would be

each time step
    for each guard in current state
      call guard.probe(x), save guard with largest result
    if any guard.probe() return non-zero
      guard = guard with largest priority number returned from probe
      x = guard.reset(x)
      guard.transition(), possibly sets current state
    xdot = current_state.f(x,u)

    x += dt * xdot
