document.addEventListener('keydown', function(event) {
    if(event.keyCode == 37) {
        alert('Left was pressed');
    } else if (event.keyCode == 39) {
        alert('Right was pressed');
    }
});

document.addEventListener('mousedown', function(event) {
    var c = goal_context;
    
    var l = (event.offsetX-X-10)/sv;
    var t = (event.offsetY-Y-10)/sv;
    var r = (event.offsetX-X+10)/sv;
    var b = (event.offsetY-Y+10)/sv;

    goal = [(r+l)/2, (b+t)/2];
    goal_poly = [[l,t],[l,b],[r,b],[r,t],[l,t]];

    c.clearRect(0,0,1440,1440);
    c.save();
    c.beginPath();
    c.rect(event.offsetX - 10, event.offsetY - 10, 20, 20);
    c.fillStyle = 'green';
    c.fill();
    c.lineWidth = 2;
    c.strokeStyle = 'black';
    c.stroke();
    c.restore();
});

document.addEventListener('mouseup', function(event) {
});
