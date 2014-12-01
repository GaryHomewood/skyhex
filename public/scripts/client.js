var SKYHEX = SKYHEX || {}

SKYHEX = {
    updatePhoto: function() {
        var socket = io();
        var src = "";
        var dominantHex = "";
        $("body").tooltip({ selector: '[data-toggle="tooltip"]' });
        $('#colour-history-item').tooltip();

        $('#skyphoto').load(function() {
        });

        socket.on('PHOTO_MOVED', function(hex) {
            // add a random querystring to force image refresh
            src = '/images/img.png?' + Math.random();
            $('#skyphoto').attr('src', src);
            console.log(hex);

            // show the current hex at the top
            $('.colour').css('background-color', hex);
            $('.colour p').text(hex);

            // add a swatch of the current colour to the history
            var historyitem = $("<div class='colour-history-item' data-toggle='tooltip' title='HEX: " + hex + "'></div>");
            historyitem.css('background-color', hex);
            if ($('.colour-history-item').length) {
                $('.colour-history-item').first().before(historyitem);
            } else {
                $('.colour-history').prepend(historyitem);
            }
        });
    }
}
