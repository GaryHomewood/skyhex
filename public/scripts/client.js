var SKYHEX = SKYHEX || {}

SKYHEX = {
    updatePhoto: function() {
        var socket = io();
        socket.on('PHOTO_MOVED', function() {
            var src = '/images/img.png?' + Math.random();
            $('#skyphoto').attr('src', src);

            var image = new Image();
            image.src = "/images/img.png";
            var colorThief = new ColorThief();
            var color = colorThief.getColor(image);

            var r = parseInt(color[0], 10);
            var g = parseInt(color[1], 10);
            var b = parseInt(color[2], 10);
            var hex = '#'+ r.toString(16) + g.toString(16) + b.toString(16);

            $('body').css('background-color', hex);
        });
    }
}
