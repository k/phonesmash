var socket = io.connect('/');

// gets called on mobile form submit
function joinSession(roomID, userName) {
	// TODO fix this
	if (roomID === "") {
		location.reload();
	} else {
		// tell the server we want to connect
		socket.emit('mobileConnect', {'roomID': roomID, 'username': userName});

        // TODO: do something with userName
		renderThrowView();
	}
}

function renderThrowView () {
	$('.start-session').hide();
	$('#throw').show();
    startUp();
}

// if join successful, log the success
socket.on('mobileReady', function(msg) {
	console.log(msg);
});


function startUp() {
    elm = document.getElementById('throw');
    elm.addEventListener('touchstart', startHandler, false);
    elm.addEventListener('touchend', endHandler, false);
}

function startHandler(event) {
    socket.emit('testing', "touch started");
    event.preventDefault();
    holdingUI();
}

function endHandler(event) {
    socket.emit('testing', "touch ended");
    event.preventDefault();
    measureTime();
    flyingUI();
}

function holdingUI() {
    $('#throw').css('background-color', '#E81373');
    $('#throw-text').text('throw phone when ready');
}

function flyingUI() {
    $('#throw').css('background-color', '#9A15FF');
    $('#throw-text').text('WOOOO!');
}

var stoppingThreshold = 5;
var stoppingDelta = 0.25;

function measureTime(){ 

    // start time and report startTime
    var startTime = Date.now();
    socket.emit('startTime', startTime);
    var prevforce = -1;
    var prevtime = Date.now();

    window.ondevicemotion = function(e) {
        ax = event.accelerationIncludingGravity.x;
        ay = event.accelerationIncludingGravity.y;
        az = event.accelerationIncludingGravity.z;

        var force = Math.sqrt(Math.pow(ax, 2) + Math.pow(ay, 2) + Math.pow(az, 2));
        var now = Date.now();
        if (prevforce == -1) prevforce = force;
        var delta = Math.abs((force - prevforce) / (now - prevtime));
        socket.emit('testing', 'Force: ' + force);
        socket.emit('testing', 'Delta: ' + delta);
        socket.emit('testing', 'stoppingDelta: ' + stoppingDelta);

        if (delta > stoppingDelta) {

            // stop timer, report elapsed and stop collecting data
            var endTime = Date.now();
            var elaspedTime = endTime - startTime;
            
            socket.emit('testing', "time" + elaspedTime);
            socket.emit('elaspedTime', elaspedTime);

            $('#throw').css('background-color', '#E89913');
            $('#throw-text').text('your time was: ' + elaspedTime);

            window.ondevicemotion = null;
        }
        prevtime = now;
        prevforce = force;
    };
}
