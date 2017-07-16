import perfjankie from 'perfjankie';
var debug = require('debug')('pj:runner');

export default (run, opts = {}) => new Promise((resolve, reject) => {
	let { repeat, server } = { repeat: 1, server: 'http://localhost:5984', ...opts };
	perfjankie({
		url: 'http://localhost:8080',
		suite: 'React Performance tests',
		name: 'DBMonster',
		repeat,
		run,
		couch: { server, database: 'react-perf' },
		selenium: 'http://localhost:9515',
		browsers: [{ browserName: 'chrome' }],
		time: (run + '....').split(/[\.-]/g).slice(0, 4).map(function (part) {
			return ((isNaN(parseInt(part)) ? 'ZZZZZ' : '00000') + part).slice(-5);
		}).join('.'),
		callback(err, res) {
			if (err) {
				reject(err);
			} else {
				resolve(res);
			}
		},
		log: debug
	});
});