#! /usr/local/bin/node

var prepareDBMonster = require('./dbmonster');

if (process.argv.length !== 4) {
	console.error('Need to specify version of React and output directory');
	console.error('Example : ', process.argv[0], process.argv[1], '0.13.0 ./bin');
	process.exit(1);
}

prepareDBMonster(process.argv[3], process.argv[2]);