var firstPath = new Path({
	segments: [[0, 115], [100, 180], [200, 130]],
	selected: true
});

var userPath;

// The mouse has to drag at least 20pt
// before the next drag event is fired:
tool.minDistance = 20;

function onMouseDown(event) {
	if (userPath) {
		userPath.selected = false;
	};
    userPath = new Path();
    // make sure that it starts where the other line ends
    userPath.add(new Point(200, 130));
    userPath.strokeColor = '#2f8fce';
    userPath.strokeWidth = 2;
    userPath.strokeCap = 'round';
	userPath.fullySelected = true;
}

function onMouseDrag(event) {
	userPath.add(event.point);
}

function onMouseUp(event) {
    userPath.selected = false;

    // attempt to get final segment value
    console.log(userPath);
    console.log(userPath.segments);
    console.log(userPath.segments.length);

    var lastY = userPath.segments[userPath.segments.length - 1].point.y

    userPath.add(new Point(700, lastY));


    // When the mouse is released, simplify it:
	userPath.simplify();
    userPath.smooth();
    userPath.dashArray = [6, 8];
}