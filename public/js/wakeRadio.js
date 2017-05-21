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
	let date = $('#wake_date').val().split('-');
	console.log('offset: ' + new Date().getTimezoneOffset());
	let timestamp = Date.UTC(parseInt(date[0]), parseInt(date[1] - 1), parseInt(date[2]), parseInt($('#hours').val()), parseInt($('#minutes').val() - 120));
	console.log(new Date(timestamp));
	socket.emit('add_alarm', timestamp);
});

/*
socket.on('volume', v => {
	console.log('volume: ' + v);
});
*/