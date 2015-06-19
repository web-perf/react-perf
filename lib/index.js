var path = require('path');
var fs = require('fs');

var perfjankie = require('perfjankie');

var prepare = require('./prepare');

module.exports = function(version, binDir, cb) {
	var BIN_DIR = path.join(binDir, 'v' + version);
	console.log('Running test for ', version);
	prepare(BIN_DIR, version, function() {
		perfjankie({
			url: 'http://localhost:8080/v' + version + '/index.html',
			suite: "React Performance tests",
			name: 'DBMonster',
			time: generateTime(version),
			run: version,
			repeat: 10,
			couch: {
				server: 'http://localhost:5984',
				database: 'react-perf'
			},
			selenium: 'http://localhost:9515',
			browsers: [{
				browserName: "android"
			}],
			callback: function(err, res) {
				if (err) {
					console.log(err);
				}
				cb();
			}
		});
	});
}

function generateTime(version) {
	// Assuming version is of form x.y.z-rcA
	return (version + '....').split(/[\.-]/g).slice(0, 4).map(function(part) {
		return ((isNaN(parseInt(part)) ? 'ZZZZZ' : '00000') + part).slice(-5);
	}).join('.');
}