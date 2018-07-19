var firstPath = new Path({
	segments: [[0, 220], [50, 200], [100, 205], [150, 190], [200, 170]]
});

firstPath.strokeColor = '#ff0000'; // red

var userPath;

// The mouse has to drag at least 20pt
// before the next drag event is fired:
tool.minDistance = 20;

var mouseDown = false;

function onMouseDown(event) {
    if (mouseDown == false) {
        firstMouseDown(event);
    } else {
        otherMouseDown();
        console.log("second mouse down");
    }
}

function onMouseDrag(event) {
    if (mouseDown == false) {
        firstMouseDrag(event);
    } else {
        otherMouseDrag();
        console.log("second mouse drag");
    }
}

function onMouseUp(event) {
    if (mouseDown == false) {
        firstMouseUp(event);
    } else {
        otherMouseUp();
        console.log("second mouse up");
    }
}

function firstMouseDown() {
	if (userPath) {
		userPath.selected = false;
	};
    userPath = new Path();
    // make sure that it starts where the other line ends
    userPath.add(new Point(200, 170));
    userPath.strokeColor = '#2f8fce';
    userPath.strokeWidth = 2;
    userPath.strokeCap = 'round';
    userPath.fullySelected = true;
    
}

function otherMouseDown () {
    
}

function firstMouseDrag (event) {
	userPath.add(event.point);
}

function otherMouseDrag () {

}

function firstMouseUp () {

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
    userPath.dashArray = [4, 6];

    mouseDown = true;

}

function otherMouseUp () {

}