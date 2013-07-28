var socket = io.connect('/');

// gets called on mobile form submit
function joinSession(roomID, userName) {

    // make a call to fetch the roomID
    // socket.emit('checkRoom');

    // socket.on('getRoomID', function(currentRoomID) {
    //   if (currentRoomID === roomID) {
        // tell the server we want to connect
  socket.emit('mobileConnect', {'roomID': roomID, 'username': userName});

  socket.on('mobileReady', function(data) {
    startUp(data);
  });

        // show throw ID and continue


      // } else {
      //    renderConnectionError();
      // }
  
    // });
}


function renderConnectionError() {
    $('#errors').show();
}

function startUp(data) {

    $('.start-session').hide();
    $('#throw').show(); 
    
    elm = document.getElementById('throw');
    elm.addEventListener('touchstart', function() { startHandler(data) }, false);
    elm.addEventListener('touchend', function() { endHandler(data) }, false);
}

function startHandler(event, data) {
    console.log("startHandler");
    socket.emit('testing', "touch started");
    event.preventDefault();
    holdingUI();
}

function endHandler(event, data) {
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
    $('#throw-text').text('WOOOO!')
}

var stoppingThreshold = 10;
var stoppingDelta = 0.3;

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
            
            socket.emit('testing', "time" + elaspedTime);

            socket.emit('elaspedTime', elaspedTime);

            $('#throw').css('background-color', '#E89913');
            $('#throw-text').text('your time was: ' + elaspedTime)

            window.ondevicemotion = null;
        }
        prevtime = now;
        prevforce = force;
    };
}
