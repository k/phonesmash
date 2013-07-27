
/**
 * Module dependencies.
 */

var express = require('express'),
		routes = require('./routes'),
		session = require('./routes/session'),
		http = require('http'),
		path = require('path');
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
app.post('/start/verify', session.verify);


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
    console.log('connection made');
    socket.emit('news', {hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});
