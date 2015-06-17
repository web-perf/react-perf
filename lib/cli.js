var path = require('path');
var fs = require('fs');

var rimraf = require('rimraf');
var static = require('node-static');

var versions = require('./reactVersions').reverse();
var main = require('./index');

var BIN_DIR = path.join(__dirname, '../bin');
rimraf.sync(BIN_DIR);
fs.mkdirSync(BIN_DIR);

if (process.argv.length === 3) {
	versions = [process.argv[2]];
}

var server = require('http').createServer(function(request, response) {
	request.addListener('end', function() {
		new static.Server(BIN_DIR).serve(request, response);
	}).resume();
}).listen(8080);

(function run(i) {
	if (i < versions.length) {
		main(versions[i], BIN_DIR, function() {
			run(i + 1);
		});
	} else {
		server.close();
		console.log('All Tests complete');
	}
}(0));

/*
node node_modules/perfjankie/lib/cli.js --couch-database=react-perf --couch-user=admin_user --couch-pwd=admin_pass --only-update-site --couch-server=http://localhost:5984
*/
