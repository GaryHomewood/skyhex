var SKYHEX = SKYHEX || {}

SKYHEX = {
    updatePhoto: function() {
        var socket = io();
        socket.on('PHOTO_MOVED', function() {
            $('#skyphoto').attr('src', '/images/img.png?' + Math.random());
        });    
    }
}
