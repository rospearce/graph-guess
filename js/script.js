var firstPath = new Path({
	segments: [[0, 115], [80, 180], [200, 20]],
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
	userPath.strokeColor = '#2f8fce';
	userPath.fullySelected = true;
}

function onMouseDrag(event) {
	userPath.add(event.point);
}

function onMouseUp(event) {
    userPath.selected = false;
    // When the mouse is released, simplify it:
	userPath.simplify();
	userPath.smooth();
}