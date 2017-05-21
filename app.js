'use strict'
const express = require('express'),
	  app = express(),
	  Mplayer = require('node-mplayer'),
      http = require('http').Server(app),
	  exec = require('child_process').exec,
	  io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

var url = 'http://chai5she.cdn.dvmr.fr/franceinter-midfi.mp3';

var player = new Mplayer(url), muted = false;

var alarm_timestamps = [];

//check regularly if an alarm should ring

setInterval(() => {

	if (alarm_timestamps.length !== 0) {

		if (alarm_timestamps[0] < Date.now()) {
			if (muted) mute();
			player.play();
			alarm_timestamps.splice(0, 1);
		} else {
			console.log(`${(alarm_timestamps[0] - Date.now()) / 1000} seconds remaining`);
		}
	}
}, 1000);


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

http.listen(3000, () => {
	console.log('listening on port 3000');
	player.play({ volume: 30 });

	player.rl.on('line', (input) => {
		console.log(`Received: ${input}`);
	});

});

let mute = () => {
	player.mute();
	muted = !muted;
	console.log('mute');
};

io.on('connection', (socket) => {
	console.log('a user connected');

	socket.on('set_volume', (new_vol) => {
		console.log(new_vol);
		player.setVolume(new_vol);
	});

	socket.on('volume_req', () => {

	});

	socket.on('volume_req', () => {
		let v = player.getVolume();
		console.log('volume: ' + v);
		socket.emit('volume', player.getVolume());
	});	

	socket.on('toggle_playing', () => {
		let p = player.checkPlaying();
		console.log('playing: ' + p);

		if (p) player.mute();
		else player.play();
	});

	socket.on('mute', () => {
		mute();
	});

	socket.on('error', e => {
		console.warn(e);
	});

	socket.on('add_alarm', d => {
		d = Number(d);
		console.log('New alarm added ' + new Date(d));
		alarm_timestamps.push(d);

		alarm_timestamps.sort((a, b) => b - a);
		console.log(alarm_timestamps);
	});

});