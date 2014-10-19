var express = require('express');
var app = express();

app.use(require('connect-livereload')({port: 4002}));
app.use(express.static(__dirname + '/public'));

app.get('', function(req, res) {
    res.render('index');
});

app.post('/snap', function(req, res) {
    takePhoto();
    res.redirect('/');
});

var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection', function(socket){
    socket.on('take-photo', function(msg){
      takePhoto();
    });
});

function takePhoto() {
    var cp = require('child_process');
    cp.exec('./wacaw --png img',
        function (error, stdout, stderr) {
            if (error !== null) {
                console.log('stderr: ' + stderr);
                console.log('exec error: ' + error);
            } else {
                movePhoto();
            }
        }
    );
}

function movePhoto() {
    var cp = require('child_process');
    cp.exec('mv img.png public/images',
        function (error, stdout, stderr) {
            if (error !== null) {
                console.log('stderr: ' + stderr);
                console.log('exec error: ' + error);
            } else {
                io.emit('PHOTO_MOVED', 'photo has been moved');
            }
        }
    );
}

server.listen(5000, function() {
    console.log('Listening on port %d', server.address().port)
});
