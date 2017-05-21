'use strict'
const express = require('express'),
	  app = express(),
	  Mplayer = require('node-mplayer'),
      http = require('http').Server(app),
	  exec = require('child_process').exec,
	  io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

var url = 'http://stream.srg-ssr.ch/m/rsc_fr/mp3_128';

var player = new Mplayer(url);

var alarm_timestamps = [];

//check regularly if an alarm should ring

setInterval(() => {
	if (alarm_timestamps.length !== 0 && alarm_timestamps[0] < new Date().getTime()) {
		player.play();
		alarm_timestamps.splice(0, 1);
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

io.on('connection', (socket) => {
	console.log('a user connected');

	socket.on('set_volume', (new_vol) => {
		console.log(new_vol);
		//player.setVolume(new_vol);
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
		 player.mute();
		 console.log('mute');
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