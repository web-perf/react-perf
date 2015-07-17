var Q = require('q');
Q.longStackTrace = true;

var prepare = require('./prepare.js');
var testRunner = require('./testRunner.js');

var versions;
if (process.argv.length === 3) {
	versions = [process.argv[2]];
}

if (!versions) {
	versions = Object.keys(require('./reactVersions'));
}

prepare(versions, true).then(function(appFolders) {
	return testRunner(appFolders);
}).done();


/*
node node_modules/perfjankie/lib/cli.js --couch-database=react-perf --couch-user=admin_user --couch-pwd=admin_pass --only-update-site --couch-server=http://localhost:5984
*/