var fs = require('fs');
var path = require('path');
var request = require('request');

var TEST_APP = path.join(__dirname, './app');

function writeHTML(version, binDir) {
	var html = fs.readFileSync(path.join(TEST_APP, 'index.html'), 'utf-8');
	fs.writeFileSync(path.join(binDir, 'index.html'), html.replace(/__VERSION__/g, version));
}

function requireFromString(src, filename) {
	var Module = module.constructor;
	var m = new Module();
	m._compile(src, filename);
	return m.exports;
}

function writeScript(version, binDir, cb) {
	var downloadFile = 'http://fb.me/JSXTransformer-' + version + '.js';
	request(downloadFile, function(err, res, body) {
		if (err) {
			console.log('ERROR', err);
			process.exit(1);
		}
		var reactTools = requireFromString(body, 'reacttools');
		var jsx = reactTools.transform(fs.readFileSync(path.join(TEST_APP, 'script.jsx'), 'utf-8'));
		fs.writeFileSync(path.join(binDir, 'script.js'), jsx.code);
		cb();
	});
}


module.exports = function(version, binDir, cb) {
	var resultDir = path.join(binDir, 'v' + version)
	try {
		fs.mkdirSync(resultDir);
	} catch (e) {}
	writeHTML(version, resultDir);
	writeScript(version, resultDir, function() {
		cb(resultDir);
	});
};