// Given an object with versions and folders, runs the tests

var Q = require('q');
var path = require('path');
var debug = require('debug')('testRunner');
var run = require('child_process').fork;
var request = require('request');

var pjRunner = require('./pjRunner.js');

function checkForServer(url, retries, interval) {
	retries = retries || 5;
	interval = interval || 1000;
	debug('Checking for server %s (%d, %d)', url, retries, interval);
	return Q.Promise(function(resolve, reject, notify) {
		(function run(retries) {
			if (retries <= 0) {
				reject('Could not reach ', url);
			} else {
				request(url, function(err, resp, body) {
					if (!err && resp.statusCode === 200) {
						debug('Found server');
						resolve();
					} else {
						debug('Could not find server, trying again till %d', retries);
						setTimeout(function() {
							run(--retries);
						}, interval);
					}
				});
			}
		}(retries));
	});
}

function addTestToQueue(version, appFolder) {
	return function() {
		return Q.Promise(function(resolve, reject, notify) {
			var child = run(path.join(path.join(appFolder, 'server.js')), [version], {
				cwd: appFolder
			});
			child.on('error', function(e) {
				reject(e);
			});

			child.on('exit', function(code, signal) {
				debug('Killing child process');
				resolve(code);
			});

			checkForServer('http://localhost:8080').then(function() {
				debug('Starting test for %s', version);
				return pjRunner(version).fin(function() {
					child.kill('SIGHUP');
				});
			});
		});
	}
}



module.exports = function(appFolders) {
	var version = '0.13.0';
	var queue = [];
	for (var version in appFolders) {
		queue.push(addTestToQueue(version, appFolders[version]));
	}
	return queue.reduce(Q.when, Q());
};