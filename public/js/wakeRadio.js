var socket = io();

$('#mute-btn').click(function(e) {
	e.stopPropagation();
	console.log('mute');
	socket.emit('set_volume', 0);
});

$('#pause-btn').click(function(e) {
	e.stopPropagation();
	console.log('pause');
	socket.emit('pause', null);
});

$('#play-btn').click(function(e) {
	e.stopPropagation();
	console.log('play');
	socket.emit('play', null);
});