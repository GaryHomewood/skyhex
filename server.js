var express = require('express');
var app = express();

app.use(require('connect-livereload')({port: 4002}));
app.use(express.static(__dirname + '/public'));
//app.engine('.html', require('ejs').renderFile);

var Datastore = require('nedb');
var db = new Datastore({ filename: 'public/skyhex.db', autoload: true });

// app.get('/', function(req, res) {
//     console.log('root:');
//     //res.render('index.html');
// });

app.post('/snap', function(req, res) {
    takePhoto();
    res.redirect('/');
});

var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection', function(socket){
    socket.on('take-photo', function(msg){
        console.log('taking photo:');
        db.find({}, function(err, docs) {
            console.log(docs);
        });

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
                getColour();
            }
        }
    );
}

/**
* Use imagemagick to get the dominant colour of the photo, returned as sRGB
*/
function getColour() {
    var cp = require('child_process');
    cp.exec("convert public/images/img.png -scale 1x1\\! -format '%[pixel:u]' info:-",
        function (error, sRGB, stderr) {
            if (error !== null) {
                console.log('stderr: ' + stderr);
                console.log('exec error: ' + error);
            } else {
                console.log('dominant hex: ' + sRGB + " - " + toHex(sRGB));

                // save to datastore
                var hex = toHex(sRGB);
                var doc = {
                  hex: hex,
                  today: new Date()
                };
                db.insert(doc, function(err, newDoc){});

                // return hex to client
                io.emit('PHOTO_MOVED', toHex(sRGB));
            }
        }
    );
}

/**
* Convert RGB to HEX
*/
function toHex(sRGB) {
    var parts = sRGB.slice(sRGB.indexOf("(") + 1, sRGB.indexOf(")")).split(",")
    var red = parts[0];
    var green = parts[1];
    var blue = parts[2];
    return "#" + ((blue | green << 8 | red << 16) | 1 << 24).toString(16).slice(1);
}

server.listen(5000, function() {
    console.log('Listening on port %d', server.address().port)
});
