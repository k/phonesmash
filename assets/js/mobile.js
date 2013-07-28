var socket = io.connect('/');

// gets called on mobile form submit
function joinSession(roomID, userName) {
	// TODO fix this
	if (roomID === "") {
		location.reload();
	} else {
		// tell the server we want to connect
		socket.emit('mobileConnect', roomID);

        // TODO: do something with userName

        // TODO: if first connection
		renderThrowView();
	}
}

function renderThrowView () {
	$('.start-session').hide();
	$('.throw').show();
    startUp();
}

// if join successful, log the success
socket.on('mobileReady', function(msg) {
	console.log(msg);
});


function startUp() {
    el = document.getElementByClass('throw');
    el.addEventListener('touchstart', function (event) {
        socket.emit('testing', "touch started");
        event.preventDefault();
        $('.throw').css('background-color', 'blue');
    }, false);
    el.addEventListener('touchend', function (event) {
        socket.emit('testing', "touch ended");
        event.preventDefault();
        $('.throw').css('background-color', 'green');
        measureTime();
    }, false);
}

//    if (window.DeviceMotionEvent !== undefined) {

var stoppingThreshold = 10;
var stoppingDelta = 0.15;

function measureTime(){ 

    // start time and report startTime
    var startTime = Date.now();
    socket.emit('startTime', startTime);
    var prevforce = -1;
    var prevtime = Date.now();

    window.ondevicemotion = function(e) {
        ax = event.acceleration.x;
        ay = event.acceleration.y;
        az = event.acceleration.z;

        var force = Math.sqrt(Math.pow(ax, 2) + Math.pow(ay, 2) + Math.pow(az, 2));
        var now = Date.now();
        var delta = Math.abs((force - prevforce) / (now - prevtime));
        socket.emit('testing', 'Force: ' + force);
        socket.emit('testing', 'Delta: ' + delta);

        if (force > stoppingThreshold && delta > stoppingDelta) {

            // stop timer, report elapsed and stop collecting data
            var endTime = Date.now();
            var elaspedTime = endTime - startTime;
            socket.emit('elaspedTime', elaspedTime);

            $('body').css('background-color', 'green');
            window.ondevicemotion = null;
        }
        prevtime = now;
        prevforce = force;
    };
}
