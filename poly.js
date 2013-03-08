// copyright 2013, Robert Monsen. All Rights Reserved.
// permission is granted for individual use, provided
// this copyright statement remains intact.

// polygon intersection code. Used for sensors to determine if the
// sensor sees an obstacle.

var poly = new Object();

poly.lines_intersect = function(a,b,c,d) {
    function ccw(a,b,c) {
        return (c[1]-a[1])*(b[0]-a[0]) > (b[1]-a[1])*(c[0]-a[0]);
    }
    return ccw(a,c,d) != ccw(b,c,d) && ccw(a,b,c) != ccw(a,b,d);
}

poly.point_in_polygon = function(pt, p) {
    var maxpt = [32767,32767];
    var intersections = 0;

    for (var i = 0; i < p.length; i++) {
        intersections += poly.lines_intersect(p[i], p[(i+1) % p.length], pt, maxpt);
    }
    return (intersections & 1) != 0;
}

poly.line_in_polygon = function(line, p) {
    for (var i = 0; i < p.length; i++) {
        if (poly.lines_intersect(line[0], line[1], p[i], p[(i+1)%p.length])) {
            return true;
        }
    }
    return false;
}

poly.polygon_in_polygon = function(p1, p2) {
    for (var i = 0; i < p1.length; i++) {
        if (!poly.point_in_polygon(p1[i], p2)) {
            return false;
        }
    }
    for (var i = 0; i < p1.length; i++) {
        for (var j = 0; j < p2.length; j++) {
            if (poly.lines_intersect(p1[i], p1[(i+1) % p1.length],
                                p2[j], p2[(j+1) % p2.length])) {
                return false;
            }
        }
    }
    return true;
}

poly.polygons_intersect = function(p1, p2) {
    // check for p2 points inside p1
    for (var i = 0; i < p2.length; i++) {
        if (poly.point_in_polygon(p2[i], p1)) {
            return true;
        }
    }

    // check for p1 points inside p2
    for (var i = 0; i < p1.length; i++) {
        if (poly.point_in_polygon(p1[i], p2)) {
            return true;
        }
    }

    for (var i = 0; i < p1.length; i++) {
        for (var j = 0; j < p2.length; j++) {
            if (poly.lines_intersect(p1[i], p1[(i+1)%p1.length],
                                     p2[j], p2[(j+1)%p2.length])) {
                return true;
            }
        }
    }
    return false;
}



