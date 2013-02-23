// copyright 2013, Robert Monsen. All Rights Reserved.
// permission is granted for individual use, provided
// this copyright statement remains intact.

// polygon intersection code. Used for sensors to determine if the
// sensor sees an obstacle.

function lines_intersect(a,b,c,d) {
    function ccw(a,b,c) {
        return (c[1]-a[1])*(b[0]-a[0]) > (b[1]-a[1])*(c[0]-a[0]);
    }
    return ccw(a,c,d) != ccw(b,c,d) && ccw(a,b,c) != ccw(a,b,d);
}

function point_in_polygon(pt, poly) {
    var maxpt = [32767,32767];
    var intersections = 0;

    for (var i = 0; i < poly.length; i++) {
        intersections += lines_intersect(poly[i], poly[(i+1) % poly.length], pt, maxpt);
    }
    return (intersections & 1) != 0;
}

function line_in_polygon(line, poly) {
    for (var i = 0; i < poly.length; i++) {
        if (lines_intersect(line[0], line[1], poly[i], poly[(i+1)%poly.length])) {
            return true;
        }
    }
    return false;
}

function polygon_in_polygon(poly1, poly2) {
    for (var i = 0; i < poly1.length; i++) {
        if (!point_in_polygon(poly1[i], poly2)) {
            return false;
        }
    }
    for (var i = 0; i < poly1.length; i++) {
        for (var j = 0; j < poly2.length; j++) {
            if (lines_intersect(poly1[i], poly1[(i+1) % poly1.length],
                                poly2[j], poly2[(j+1) % poly2.length])) {
                return false;
            }
        }
    }
    return true;
}

function polygons_intersect(poly1, poly2) {
    // check for poly2 points inside poly1
    for (var i = 0; i < poly2.length; i++) {
        if (point_in_polygon(poly2[i], poly1)) {
            return true;
        }
    }

    // check for poly1 points inside poly2
    for (var i = 0; i < poly1.length; i++) {
        if (point_in_polygon(poly1[i], poly2)) {
            return true;
        }
    }

    for (var i = 0; i < poly1.length; i++) {
        for (var j = 0; j < poly2.length; j++) {
            if (lines_intersect(poly1[i], poly1[(i+1)%poly1.length],
                                poly2[j], poly2[(j+1)%poly2.length])) {
                return true;
            }
        }
    }
    return false;
}



