var robot_context = document.getElementById('robotCanvas').getContext('2d');
var obst_context = document.getElementById('obstCanvas').getContext('2d');
var sv = 200;
var X = 400;
var Y = 400;

var obsts;

function drawObsts(obsts) {
    obst_context.clearRect(0,0,1280,720);
    obst_context.translate(X,Y); // move drawing surface around
    obst_context.beginPath();
    for (var oi = 0; oi < obsts.length; oi++) {
        var i;
        obst = obsts[oi];
        for (i = 0; i < obst.length; i++) {
            obst_context.moveTo(sv*obst[i][0], sv*obst[i][1]);
            obst_context.lineTo(sv*obst[(i+1) % obst.length][0], sv*obst[(i+1)%obst.length][1]);
        }
    }
    obst_context.stroke();
}            

var xhr = new XMLHttpRequest();

// load that bloody XML file...
function loadXML() {
    var nobstacles = 0
    var obstacles = [];

    var doc = xhr.responseXML;
    var dobsts = doc.getElementsByTagName('obstacle');

    for (var index = 0; index < dobsts.length; index++) {
        opose = dobsts[index].getElementsByTagName('pose')[0];
        pose = [1*opose.attributes['x'].value, 1*opose.attributes['y'].value, 1*opose.attributes['theta'].value];
        points = dobsts[index].getElementsByTagName('point');
        obstacle = [];
        for (var ip = 0; ip < points.length; ip++) {
            obstacle[ip] = [1*points[ip].attributes['x'].value, 1*points[ip].attributes['y'].value];
        }
        obstacle = rotate_poly(obstacle, pose[2]);
        obstacle = translate_poly(obstacle, pose);
        obstacles[nobstacles++] = obstacle;
    }
    obsts = obstacles;
    drawObsts(obsts, sv);       // obstacles are in a different canvas from the robot
    run_robot(robot_context, [0,0,0]);
}

xhr.open('GET', 'robot-settings.xml', true);
xhr.onload = loadXML;
xhr.send(null);

