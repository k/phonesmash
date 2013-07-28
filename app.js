
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
        var msg = 'desktop joined the room!';
        socket.set('roomID', roomID, function(err, roomID) {
            socket.join(roomID);
            socket.in(roomID).emit('desktopReady', msg);    
        });     
    });

    socket.on('mobileConnect', function(roomID) {
        var msg = 'mobile joined the room!';
        socket.set('roomID', roomID, function(err, roomID) {
            socket.join(roomID) ;
            socket.in(roomID).emit('mobileReady', msg);
        });        
    });

    socket.on('startTime', function(time) {
        socket.get('roomID', function (err, roomID) {
            socket.in(roomID).emit('started', time);
        });
    });

    socket.on('elapsedTime', function(time) {
        socket.get('roomID', function (err, roomID) {
            socket.in(roomID).emit('elapsed', time);
        });
    });

    socket.on('testing', function(data) {
        console.log(data);
    });
});
