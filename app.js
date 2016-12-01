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
  exec('rem control_fifo');
  exec('mkfifo control_fifo');
  exec('mplayer -slave -input file=./control_fifo http://stream.srg-ssr.ch/m/rsc_fr/mp3_128', (err, out) => {
	  if (err) console.log(err);
	  if (out) console.log(out);
  });
});

function mplayer(cmd) {
	exec('echo ' + cmd + ' > control_fifo', (err, out) => {return {err: err, out: out};});
}

var getVolume = (handler) => {
	mplayer('get_property volume', (err, out) => {
		handler(parseInt(out.split('=')[1]));
	});
};

var getCurrentlyPlaying = (handler) => {
	exec('mpc current', (err, out) => {
		handler(out);
	});

var setVolumeDown = (handler) => {
		exec('/');
};

var setVolumeUp = (handler) => {
	exec('*');
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
		 mplayer('pause');
		 console.log('pause');
	});

});