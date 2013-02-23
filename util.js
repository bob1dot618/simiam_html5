// copyright 2013, Robert Monsen. All Rights Reserved.

// ensure that angle is in the range [-PI, PI)
function normalize_angle(angle) {
    return Math.atan2(Math.sin(angle),Math.cos(angle));
}

function cartesian_to_polar(pt) {
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

function polar_to_cartesian(pt) {
    var angle = pt[1];
    var r = pt[0];

    return [r*Math.cos(angle), r*Math.sin(angle)];
}

// rotate a point around the origin by theta radians
function rotate_pt(pt, theta) {
    ppt = cartesian_to_polar(pt);
    ppt[1] += theta;
    ppt[1] = normalize_angle(ppt[1]);

    // convert back to cartesian coordinates
    return polar_to_cartesian(ppt);
}

// rotate a polygon around the origin by theta radians
function rotate_poly(poly, theta) {
    var result = [];

    for (var i = 0; i < poly.length; i++) {
        result[i] = rotate_pt(poly[i], theta);
    }
    return result;
}

function translate_poly(poly, pt) {
    var result = [];

    for (var i = 0; i < poly.length; i++) {
        result[i] = [poly[i][0] + pt[0], poly[i][1] + pt[1]];
    }
    return result;
}

function print_poly(poly) {
    console.log('polygon: ');
    for (var i=0; i < poly.length; i++) {
        console.log(poly[i][0], poly[i][1]);
    }
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
