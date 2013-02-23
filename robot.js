// copyright 2013, Robert Monsen. All Rights Reserved.

// robot class file. The 'run_robot()' function below runs it. It is
// called from the XML reader that gets the obstacles, in samiam.html.

// the robot variables that define the shape of the thing
var robot_inner = 
    [
        [-0.031,  0.043, 0],
        [-0.031, -0.043, 0],
        [ 0.033, -0.043, 0],
        [ 0.052, -0.021, 0],
        [ 0.057,      0, 0],
        [ 0.052,  0.021, 0],
        [ 0.033,  0.043, 0],
        [-0.031,  0.043, 0],    // repeated element, simplifies logic
    ];

var robot_outer = 
    [
        [-0.024,  0.064, 0],
        [ 0.033,  0.064, 0],
        [ 0.057,  0.043, 0],
        [ 0.074,  0.010, 0],
        [ 0.074, -0.010, 0],
        [ 0.057, -0.043, 0],
        [ 0.033, -0.064, 0],
        [-0.025, -0.064, 0],
        [-0.042, -0.043, 0],
        [-0.048, -0.010, 0],
        [-0.048,  0.010, 0],
        [-0.042,  0.043, 0],
        [-0.024,  0.064, 0],    // repeated element, simplifies logic
    ];

// this is the unrotated polygon for a sensor
var sensor_polygon = [[0,0,0], [0.197, 0.035, 0], [0.197, -0.035, 0]];

// sensor location data for the sensors the robot uses to navigate
var robot_sensors =
    [
        // x, y, angle of repose, angle to use when sensor is activated
        [0.019,   0.064, 75*Math.PI/180, -(90-75)*Math.PI/180],
        [0.050,   0.050, 42*Math.PI/180, -(90-42)*Math.PI/180],
        [0.070,   0.017, 13*Math.PI/180, -(90-13)*Math.PI/180],
        [0.070,  -0.017, -13*Math.PI/180, -(13-90)*Math.PI/180],
        [0.050,  -0.050, -42*Math.PI/180, -(42-90)*Math.PI/180],
        [0.019,  -0.064, -75*Math.PI/180, -(75-90)*Math.PI/180],
        [-0.038,  0.048, 128*Math.PI/180, 0], // don't use rear facing sensors
        [-0.038, -0.048, -128*Math.PI/180, 0],
        [-0.048,  0.000, 180*Math.PI/180, 0],
    ];

var INTERVAL = 100;
function Robot(context, pose) {
    var V = 0.2;                // velocity in m/s
    var DT = INTERVAL / 1000.0; // time step in s
    var Kp = 0.05;              // this number defines how quickly the
                                // system tracks towards the reference
                                // signal (in this case, the bearing
                                // away from obstacles. Small is
                                // smoother, but too small will cause
                                // it to crash into obstacles (or the
                                // wall). Related to V, since a faster 
                                // robot should turn more quickly
    var Obst_Speed = 0.08;      // speed that the robot will move when
                                // navigating obstacles
    this.pose = pose;
    this.context = context;
    this.sensor_local_polygons = [];
    for (var i = 0; i < robot_sensors.length; i++) {
        sensor = robot_sensors[i];
        var poly = rotate_poly(sensor_polygon, sensor[2]);
        poly = translate_poly(poly, sensor);
        poly.push(poly[0]);     // add first element to end again
        this.sensor_local_polygons[i] = poly;
    }

    this.move = function(pose) {
        this.inner_polygon = translate_poly(rotate_poly(robot_inner, pose[2]), pose);
        this.outer_polygon = translate_poly(rotate_poly(robot_outer, pose[2]), pose);
        this.sensor_polygons = [];
        for (var i = 0; i < robot_sensors.length; i++) {
            var poly = rotate_poly(this.sensor_local_polygons[i], pose[2]);
            poly = translate_poly(poly, pose);
            this.sensor_polygons[i] = poly;
        }
    };

    // set up the sensor_polygons
    this.move(this.pose);

    this.draw = function() {
        this.context.clearRect(0,0,1280,720); // hack
        this.context.save();
        this.context.translate(X, Y); // X and Y are external, defined in samiam.html
        this.context.beginPath();
        this.draw_polygon(this.inner_polygon);
        this.draw_polygon(this.outer_polygon);
        this.context.strokeStyle = 'black'
        this.context.stroke();

        var sensor_vector = this.sensor_vector();
        for (var i = 0; i < this.sensor_polygons.length; i++) {
            this.context.beginPath();
            this.draw_polygon(this.sensor_polygons[i]);
            if (sensor_vector[i]) {
                this.context.strokeStyle = 'red';
            } else {
                this.context.strokeStyle = 'black';
            }
            this.context.stroke();
        }
        this.context.restore();
    };

    this.draw_polygon = function(poly) {
        this.context.moveTo(sv*poly[0][0], sv*poly[0][1]);
        for (var i = 1; i < poly.length; i++) {
            this.context.lineTo(sv*poly[i][0], sv*poly[i][1]);
        }
    };

    this.sensor_vector = function() {
        // return an array of boolean values indicating whether the
        // sensor has seen something.

        var result = [];

        // initialize the return array
        for (var j=0; j < this.sensor_polygons.length; j++) {
            result[j] = false;
        }

        // test the sensors by seeing if the polygons that define each obstacle
        // intersect with the sensor polygons.
        for (var i = 0; i < this.sensor_polygons.length; i++) {
            // NOTE that obsts is external, defined in samiam.html
            for (var j=0; j<obsts.length; j++) {
                if (polygons_intersect(obsts[j], this.sensor_polygons[i])) {
                    result[i] = true;
                }
            }
        }

        return result;
    };

    this.controller = function() {
        // this simulates the movement of the robot.

        var angle = this.pose[2]; // current angle
        var v = V;                // normal velocity
        var angular_max = 0;      // maximum sensor angle obtained

        // check the sensors, set up angular_max, which holds the
        // maximum deflection we need.
        var sensor_vector = this.sensor_vector();
        for (var i = 0; i < sensor_vector.length; i++) {
            if (sensor_vector[i]) {
                // only keep the largest, don't average
                if (Math.abs(angular_max) < Math.abs(robot_sensors[i][3])) {
                    angular_max = robot_sensors[i][3];
                }
            }
        }

        if (0 != angular_max) {
            // got a sensor reading for a sensor we care about.
            // angular max is with respect to the robot's point of view

            // this is a bit tricky. angular_max comes from the robot_sensors array
            // defined above. Each sensor has a angle defined as the direction to
            // turn if the sensor sees something. We add it into angle to turn the
            // system. 

            // if you think about it, angular_max is the error signal.
            
            angle += angular_max * Kp;
            angle = normalize_angle(angle); // normalize the angle to be in [PI,-PI)
            v = Obst_Speed;     // slow down if we see an obstacle
        }

        // add some randomness to the mix
        angle += (Math.random() - 0.5) * Math.PI * 0.03;

        // update the pose using euler integration
        var co = Math.cos(angle);
        var si = Math.sin(angle);

        var step = v * DT;
        this.pose[0] += co*step;
        this.pose[1] += si*step;
        this.pose[2] = angle;

        // move the robot
        this.move(this.pose);
        this.draw();
    }
}

function run_robot(ctx, pose) {
    var r = new Robot(ctx, pose);
    var cb = function() {
        r.controller();
    }
    setInterval(cb, INTERVAL);
}
