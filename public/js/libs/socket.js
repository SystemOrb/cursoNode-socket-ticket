var socket = io();
socket.on('connect', function() {
    console.log('Conectado al servidor');
});