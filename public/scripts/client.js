var SKYHEX = SKYHEX || {}

SKYHEX = {
    updatePhoto: function() {
        var socket = io();
        socket.on('PHOTO_MOVED', function() {
            var src = '/images/img.png?' + Math.random();
            var img = $('#skyphoto');

            img.load(function() {
              // image loaded; now get the dominant colour
              var image = new Image();
              image.src = src
              var colorThief = new ColorThief();
              var color = colorThief.getColor(image);
              var r = parseInt(color[0], 10);
              var g = parseInt(color[1], 10);
              var b = parseInt(color[2], 10);
              var hex = '#'+ r.toString(16) + g.toString(16) + b.toString(16);
              $('.colour').css('background-color', hex);
              $('.colour p').text(hex);
            });

            img.attr('src', src);
        });
    }
}
