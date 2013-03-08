document.addEventListener('keydown', function(event) {
    if(event.keyCode == 37) {
        alert('Left was pressed');
    } else if (event.keyCode == 39) {
        alert('Right was pressed');
    }
});

document.addEventListener('mousedown', function(event) {
    var c = goal_context;

//    console.log(event);

    goal = [(event.offsetX-X)/sv, (event.offsetY-Y)/sv];

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
