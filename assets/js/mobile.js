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
    removeEventListeners();
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
            socket.emit('elapsedTime', elaspedTime);

            $('#throw').css('background-color', '#E89913');
            $('#throw-text').text('your time was: ' + elaspedTime);
            $('#restart-button').show();
            $('#restart-button').click(function(){
                restart();
            });

            window.ondevicemotion = null;
        }
        prevtime = now;
        prevforce = force;
    };
}
