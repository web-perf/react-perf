var fs = require('fs');
var path = require('path');
var request = require('request');

var TEST_APP = path.join(__dirname, '../test/app');

function writeHTML(version, binDir) {
	var html = fs.readFileSync(path.join(TEST_APP, 'index.html'), 'utf-8');
	fs.writeFileSync(path.join(binDir, 'index.html'), html.replace(/__VERSION__/g, version));
}

function writeScript(version, binDir, cb) {
	var reactToolsFile = path.join(binDir, 'react-tools.js');
	var downloadFile = 'http://fb.me/JSXTransformer-' + version + '.js';

	request(downloadFile, function(err, res, body) {
		if (err) {
			console.log('ERROR', err);
			process.exit(1);
		}
		fs.writeFileSync(reactToolsFile, body);
		var reactTools = require(reactToolsFile);
		var jsx = reactTools.transform(fs.readFileSync(path.join(TEST_APP, 'script.jsx'), 'utf-8'));
		fs.writeFileSync(path.join(binDir, 'script.js'), jsx.code);
		cb();
	});
}

function prepare(binDir, version, cb) {
	fs.mkdirSync(binDir);
	writeHTML(version, binDir);
	writeScript(version, binDir, cb);
}

module.exports = prepare;