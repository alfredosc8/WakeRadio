'use strict'
const express = require('express'),
	  app = express(),
	  Mplayer = require('node-mplayer'),
      http = require('http').Server(app),
	  exec = require('child_process').exec,
	  io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

var player = new Mplayer('http://stream.srg-ssr.ch/m/rsc_fr/mp3_128');
player.play();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

http.listen(3000, () => {
  console.log('listening on port 3000');
});


io.on('connection', (socket) => {
	console.log('a user connected');

	socket.on('set_volume', (new_vol) => {
		console.log(new_vol);
		player.setVolume(50);
		//player.setVolume(new_vol);
	});

	socket.on('volume_req', () => {

	});

	socket.on('current_req', () => {

	});	

	socket.on('pause', () => {
		 player.pause();
		 console.log('pause');
	});

	socket.on('mute', () => {
		 player.mute();
		 console.log('mute');
	});

	socket.on('error', e => {
		console.warn(e);
	})

});