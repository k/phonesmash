var socket = io.connect('/');


// gets called on mobile form submit
function joinSession(roomID) {
	// TODO fix this
	if (roomID === "") {
		location.reload();
	} else {
		// tell the server we want to connect
		socket.emit('mobileConnect', roomID);
		renderThrowView();
	}
}

function renderThrowView () {

	$('#start-session').hide();
	$('#throw').show();

}

// if join successful, log the success
socket.on('mobileReady', function(msg) {
	console.log(msg);
});


function startUp() {
    var el = document.getElementsByTagName("canvas")[0];
    el.addEventListener("touchstart", handleStart, false);
    el.addEventListener("touchend", handleEnd, false);
}

function handleStart() {
    // change the UI to signify that we have started
    
}

function handleEnd() {
    measureTime();
}

//    if (window.DeviceMotionEvent !== undefined) {

var stoppingThreshold = 10;

function measureTime(){ 

    // start time and report startTime
    var startTime = Date.now();
    socket.emit('startTime', startTime);

    window.ondevicemotion = function(e) {
        ax = event.acceleration.x;
        ay = event.acceleration.y;
        az = event.acceleration.z;

        var force = Math.sqrt(Math.pow(ax, 2) + Math.pow(ay, 2) + Math.pow(az, 2));
        socket.emit('testing', force);

        if (force > stoppingThreshold) {

            // stop timer, report elapsed and stop collecting data
            var endTime = Date.now();
            var elaspedTime = endTime - startTime;
            socket.emit('elaspedTime', elaspedTime);

            window.ondevicemotion = null;
        }
    };
}
