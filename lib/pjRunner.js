var perfjankie = require('perfjankie');
var Q = require('q');
var debug = require('debug')('pj');

module.exports = function(version) {
	return Q.promise(function(resolve, reject, notify) {
		perfjankie({
			url: 'http://localhost:8080',
			suite: 'React Performance tests',
			name: 'DBMonster',
			time: (version + '....').split(/[\.-]/g).slice(0, 4).map(function(part) {
				return ((isNaN(parseInt(part)) ? 'ZZZZZ' : '00000') + part).slice(-5);
			}).join('.'),
			run: version,
			repeat: 10,
			couch: {
				server: 'http://localhost:5984',
				database: 'react-perf'
			},
			selenium: 'http://localhost:9515',
			browsers: [{
				browserName: 'chrome'
			}],
			callback: function(err, res) {
				if (err) {
					reject(err);
				} else {
					resolve(res);
				}
			},
			log: debug
		});
	});
};