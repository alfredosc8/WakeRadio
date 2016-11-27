'use strict'
const express = require('express'),
	  app = express(),
      http = require('http').Server(app),
	  exec = require('child_process').exec,
	  io = require('socket.io')(http),
	  player = require('play-sound');

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

http.listen(3000, () => {
  console.log('listening on port 3000');
  exec('mplayer http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio3_mf_p', (err, out) => {
	  if (err) console.log(err);
	  if (out) console.log(out);
  });
});

let getVolume = (handler) => {
	exec('mpc volume', (err, out) => {
		
	});
};

let getCurrentlyPlaying = (handler) => {
	exec('mpc current', (err, out) => {
		handler(out);
	});

let setVolumeDown = (handler) => {
		exec('/');
};

let setVolumeUp = (handler) => {
	exec('*');
};

let pause = (handler) => {
	exec('p');
};

};

io.on('connection', (socket) => {
	console.log('a user connected');

	socket.on('set_volume', (new_vol) => {
		console.log(new_vol);
	});

	socket.on('volume_req', () => {
		getVolume((volume) => {
			socket.emit('volume', volume);
		});
	});

	socket.on('current_req', () => {
		getCurrentlyPlaying((curr) => {
			socket.emit('current', curr);
		});
	});	

	socket.on('pause', () => {
		pause();
		console.log('pause');
	});

	socket.on('play', () => {
		pause();
		console.log('play');
	});
});