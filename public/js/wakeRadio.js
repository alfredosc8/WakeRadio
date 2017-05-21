var socket = io();

$('#wake_date').val((new Date()).toISOString().substr(0, 10));

$('#mute-btn').click(function(e) {
	e.stopPropagation();
	console.log('mute');
	socket.emit('mute', null);
});

$('#toggle-btn').click(function(e) {
	e.stopPropagation();
	console.log('toggle');
	socket.emit('toggle_playing', null);
});

$('#volume').change(function(e) {
	console.log('set volume: ' + parseInt($('#volume').val()));
	socket.emit('set_volume', parseInt($('#volume').val()));
});

$('#wake-btn').click(function(e) {
	let timestamp = new Date($('#wake_date').val()).getTime() + parseInt($('#hours').val()) * 3600000 + parseInt($('#minutes').val()) * 60000;
	socket.emit('add_alarm', timestamp);
});

/*
socket.on('volume', v => {
	console.log('volume: ' + v);
});
*/