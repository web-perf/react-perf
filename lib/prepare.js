var fs = require('fs');
var path = require('path');
var request = require('request');

var rimraf = require('rimraf');
var Q = require('q');
var glob = require('glob');
var unzip = require('unzip');
var npm = require('npm');
var debug = require('debug')('react-perf:prepare');

var reactVersions = require('./reactVersions');

// Download all the apps from the location specified in reactVersions.json
function downloadApps(versions, binDir) {
	return versions.map(function(version) {
		return function(appFolders) {
			debug('Download app for ', version);
			return Q.Promise(function(resolve, reject, notify) {
				var url = reactVersions[version];
				var dest = path.join(binDir, url.replace(/[\-\/\:\.]/g, ''));
				if (fs.existsSync(dest)) {
					debug('File already downloaded', version);
					resolve(dest);
					return;
				}

				debug('Downloading %s to %s', url, dest);
				request(url).pipe(unzip.Extract({
					path: dest
				})).on('close', function(e) {
					debug('Completed downloading for %s', version);
					resolve(dest);
				}).on('error', function(e) {
					debug('Error downloading for %s from %s to %s', version, url, dest);
					reject(e);
				});
			}).then(function(dest) {
				// Package should be in top level, or one level down
				var files = glob.sync('{.,*}/package.json', {
					cwd: dest
				});
				if (files.length !== 1) {
					return Q.reject('The zip did not contain only one app. It contained ' + files.length);
				} else {
					return Q(path.join(dest, path.dirname(files[0])));
				}
			}).then(function(dest) {
				appFolders[version] = dest;
				return appFolders;
			});
		}
	}).reduce(Q.when, Q({}));
}

// Do npm install on all apps 
function npmInstall(appFolders) {
	return Object.keys(appFolders).map(function(version) {
		return function() {
			debug('npm install for %s', version);
			return Q.ninvoke(npm, 'load', {
				prefix: appFolders[version],
				silent: true
			}).then(function() {
				return Q.ninvoke(npm.commands, 'install');
			});
		}
	}).reduce(Q.when, Q()).then(function() {
		return appFolders;
	});
}

// Returns an object with keys as versions, and value folder location of the app
// For example {0.5.0 : "c:\\appLocation\"}
// All location has package.json and all node_modules are installed. Just run npm start on that app location to start the server
function prepare(versions, useCached) {
	var BIN_DIR = path.join(__dirname, '../bin');
	if (useCached !== true) {
		rimraf.sync(BIN_DIR);
		fs.mkdirSync(BIN_DIR);
	}
	return downloadApps(versions, BIN_DIR).then(function(appFolders) {
		return npmInstall(appFolders);
	});
}

module.exports = prepare;