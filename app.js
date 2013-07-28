
/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes'),
	session = require('./routes/session'),
	http = require('http'),
	path = require('path'),
    io = require('socket.io');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use('/assets', express.static('assets'));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/start', session.index);

function handler (req, res) {
    fs.readfile(__direname  + '/index.html',
    function (err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
        }

        res.writeHead(200);
        res.end(data);
    });
}

var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var smashio = io.listen(server);

smashio.sockets.on('connection', function (socket) {

    socket.on('desktopConnect', function(roomID) {        
        socket.set('roomID', roomID, function() {
            if (socket.join(roomID))
                socket.in(roomID).emit('desktopReady', roomID);    
        });     
    });

    socket.on('mobileConnect', function(data) {
        var name = data.username;
        var roomID = data.roomID;
        socket.set('roomID', roomID, function() {
            if (socket.join(roomID))
                socket.set('username', name, function() {
                    console.log(roomID);
                    socket.broadcast.to(roomID).emit('mobileReady', data);
                });
        });        
    });

    socket.on('startTime', function(startTime) {
        socket.get('roomID', function (err, roomID) {
            socket.get('username', function (err, username) {
                console.log(username);
                var data = {
                    'username': username,
                    'startTime': startTime
                };
                socket.broadcast.to(roomID).emit('started', data);
            });
        });
    });

    socket.on('elapsedTime', function(elapsedTime) {
        socket.get('roomID', function (err, roomID) {
            socket.get('username', function (err, username) {
                console.log(username);
                var data = {
                    'username': username,
                    'elapsedTime': elapsedTime
                };
                socket.broadcast.to(roomID).emit('elapsed', data);
            });
        });
    });

    socket.on('disconnect', function() {
        socket.get('username', function(err, username) {
            socket.get('roomID', function(err, roomID) {
                console.log("disconnect");
                socket.broadcast.to(roomID).emit('user disconnected',
                    {'roomID': roomID, 'username': username});
            });
        });
    });

    socket.on('testing', function(data) {
        console.log(data);
    });
});
