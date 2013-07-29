var socket = io.connect('/');

// gets called on mobile form submit
function joinSession(roomID, userName) {

    // make a call to fetch the roomID
    // socket.emit('checkRoom');

    // socket.on('getRoomID', function(currentRoomID) {
    //   if (currentRoomID === roomID) {
        // tell the server we want to connect
  socket.emit('mobileConnect', {'roomID': roomID, 'username': userName});

  startUp();

        // show throw ID and continue


      // } else {
      //    renderConnectionError();
      // }
  
    // });
}

function renderConnectionError() {
    $('#errors').show();
}

function startUp() {

    $('#start-session').hide();
    $('#throw').show(); 
    
    addEventListeners();
}

function restart() {
    removeEventListener();

    // change UI to original state
    $('#throw').css('background-color', '#FF5B22');
    $('#throw-text').text('press and hold the screen to begin');
    $('#restart-button').hide();

    addEventListeners();
}

function addEventListeners() {
    elm = document.getElementById('throw');
    elm.addEventListener('touchstart', startHandler, false);
    elm.addEventListener('touchend', endHandler, false);
}

function removeEventListeners() {
    elm = document.getElementById('throw');
    elm.removeEventListener('touchstart', startHandler);
    elm.removeEventListener('touchend', endHandler);
}

function startHandler(event) {
    window.ondevicemotion = function(event) {
        console.log("Prelaunch");
    }
    event.preventDefault();
    holdingUI();
}

function endHandler(event) {
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
    removeEventListeners();
}

var stoppingThreshold = 3;
var stoppingDelta = 0.2;
var minTime = 200;
var rotMin = 500;

function measureTime(){ 

    // start time and report startTime
    var startTime = Date.now();
    socket.emit('startTime', startTime);
    var prevforce = -1;
    var prevtime = Date.now();
    var check = false;

    window.ondevicemotion = function(e) {
        ax = event.acceleration.x;
        ay = event.acceleration.y;
        az = event.acceleration.z;
        gx = event.accelerationIncludingGravity.x;
        gy = event.accelerationIncludingGravity.y;
        gz = event.accelerationIncludingGravity.z;
        rx = event.rotationRate.alpha;
        ry = event.rotationRate.beta;
        rz = event.rotationRate.gamma;

        var force = Math.sqrt(Math.pow(ax, 2) + Math.pow(ay, 2) + Math.pow(az, 2));
        var gforce = Math.sqrt(Math.pow(gx, 2) + Math.pow(gy, 2) + Math.pow(gz, 2));
        var rot = Math.sqrt(Math.pow(rx, 2) + Math.pow(ry, 2) + Math.pow(rz, 2));
        var now = Date.now();
        var delta = now - prevtime;
        if (prevforce == -1) prevforce = gforce;
        var jerk = Math.abs((gforce - prevforce) / (delta));
        // socket.emit('testing', "F: " + force + "\nGF:" + gforce +  "\nJ:" + jerk + "\nR:" + rot);

        if (now - startTime > minTime && ((jerk > stoppingDelta && rot < rotMin) 
                    || (force < stoppingThreshold && check))) {

            // stop timer, report elapsed and stop collecting data
            var endTime = Date.now();
            var elaspedTime = endTime - startTime;
            
            socket.emit('elapsedTime', elaspedTime);

            $('#throw').css('background-color', '#E89913');
            $('#throw-text').text('your time was: ' + elaspedTime);
            $('#restart-button').show();
            $('#restart-button').click(function(){
                restart();
            });

            window.ondevicemotion = null;
        }
        if (force < stoppingThreshold) check = true;
        prevtime = now;
        prevforce = force;
    };
}
