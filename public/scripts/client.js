var SKYHEX = SKYHEX || {}

SKYHEX = {
    updatePhoto: function() {
        var socket = io();
        var src = "";

        $('#skyphoto').load(function() {
            // get the dominant colour once the image is loaded
            var colorThief = new ColorThief();
            var image = new Image();
            image.src = src
            var rgb = colorThief.getColor(image);

            // convert the rgb to hex
            var rgbCode = 'rgb( ' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
            var hex = one.color(rgbCode).hex();

            // show the current hex at the top
            $('.colour').css('background-color', hex);
            $('.colour p').text(hex);

            // also add the current colour to the history
            var historyitem = $("<div class='colour-history-item'><span>" + hex + "</span></div>");
            historyitem.css('background-color', hex);
            if ($('.colour-history-item').length) {
                $('.colour-history-item').first().before(historyitem);
            } else {
                $('.colour-history').prepend(historyitem);
            }
        });

        socket.on('PHOTO_MOVED', function() {
            // add a random querystring to force image refresh
            src = '/images/img.png?' + Math.random();
            $('#skyphoto').attr('src', src);
        });
    }
}
