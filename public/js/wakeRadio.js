var socket = io();

$('#mute-btn').click(function(e) {
	e.stopPropagation();
	console.log('mute');
	socket.emit('mute', null);
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

$('#volume').change(function(e) {
	socket.emit('set_volume', parseInt($('#volume').val()));
});