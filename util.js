// copyright 2013, Robert Monsen. All Rights Reserved.
// permission is granted for individual use, provided
// this copyright statement remains intact.

var util = new Object();

// ensure that angle is in the range [-PI, PI)
util.normalize_angle = function(angle) {
    return Math.atan2(Math.sin(angle),Math.cos(angle));
}

util.cartesian_to_polar = function(pt) {
    var angle;
    var r;

    // convert pt to polar coordinates
    if (pt[0] == 0) {
        if (pt[1] == 0) {
            // screwed
            return [0, 0];
        }
        if (pt[1] < 0) {
            angle = -Math.PI/2; // pointing down
            r = -pt[1];
        } else {
            angle = Math.PI/2;  // pointing up
            r = pt[1];
        }
    } else {
        angle = Math.atan2(pt[1], pt[0]);
        r = Math.sqrt(pt[0]*pt[0] + pt[1]*pt[1]);
    }

    return [r, angle];
}

util.polar_to_cartesian = function(pt) {
    var angle = pt[1];
    var r = pt[0];

    return [r*Math.cos(angle), r*Math.sin(angle)];
}

// rotate a point around the origin by theta radians
util.rotate_pt = function(pt, theta) {
    ppt = util.cartesian_to_polar(pt);
    ppt[1] += theta;
    ppt[1] = util.normalize_angle(ppt[1]);

    // convert back to cartesian coordinates
    return util.polar_to_cartesian(ppt);
}

// rotate a polygon around the origin by theta radians
util.rotate_poly = function(poly, theta) {
    var result = [];

    for (var i = 0; i < poly.length; i++) {
        result[i] = util.rotate_pt(poly[i], theta);
    }
    return result;
}

util.translate_poly = function(poly, pt) {
    var result = [];

    for (var i = 0; i < poly.length; i++) {
        result[i] = [poly[i][0] + pt[0], poly[i][1] + pt[1]];
    }
    return result;
}

util.print_poly = function(poly) {
    console.log('polygon: ');
    for (var i=0; i < poly.length; i++) {
        console.log(poly[i][0], poly[i][1]);
    }
}

//http://js-tut.aardon.de/js-tut/tutorial/position.html
util.getElementPosition = function(element) {
    var elem=element, tagname="", x=0, y=0;
    
    while((typeof(elem) == "object") && (typeof(elem.tagName) != "undefined")) {
        y += elem.offsetTop;
        x += elem.offsetLeft;
        tagname = elem.tagName.toUpperCase();

        if(tagname == "BODY")
            elem=0;

        if(typeof(elem) == "object") {
            if(typeof(elem.offsetParent) == "object")
                elem = elem.offsetParent;
        }
    }

    return {x: x, y: y};
}

util.distance = function(a,b) {
    d = [b[0]-a[0], b[1]-a[1]];
    return Math.sqrt(d[0]*d[0] + d[1]*d[1]);
}

// function test_rotate() {
//     for (var i=0; i < Math.PI*2; i+= 2*Math.PI/10) {
//         var pt = polar_to_cartesian([1, i]);
//         console.log(pt[0], pt[1]);
//     }
// }

// function test_rotate_poly() {
// //    var poly = [[0,0], [.5,.5], [.5,-.5]];
//     var poly = [[0,0], [.5,-.5], [-.5,-.5]];
//     poly = rotate_poly(poly, 0); // rotate it ccw
//     for (var i=0; i < poly.length; i++) {
//         console.log(poly[i][0], poly[i][1]);
//     }
// }
