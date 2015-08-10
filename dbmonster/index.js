var path = require('path');
var fs = require('fs');
var npm = require('npm');
var webpack = require('webpack')

module.exports = function(version, binDir, cb) {
	binDir = path.join(binDir, version)
	try {
		fs.mkdirSync(binDir);
	} catch (e) {}

	npmInstall(version, function() {
		fs.writeFileSync(path.join(binDir, 'index.html'), fs.readFileSync(path.join(__dirname, 'app/index.html')));
		pack(binDir, function() {
			cb(path.join(binDir));
		});
	});
};

function npmInstall(version, cb) {
	npm.load({
		prefix: path.resolve(__dirname, '..')
	}, function(err, npm) {
		npm.commands.install(['react@' + version, 'react-dom@' + version], cb);
	});
};

function pack(binDir, cb) {
	webpack({
		entry: [
			path.join(__dirname, 'app/main.jsx')
		],
		output: {
			path: binDir,
			filename: 'script.js'
		},
		resolve: {
			extensions: ['', '.js', '.jsx']
		},
		module: {
			loaders: [{
				test: /\.jsx?$/,
				exclude: /(node_modules|bower_components)/,
				loaders: ['babel'],
			}]
		},
		plugins: [
			new webpack.NoErrorsPlugin()
		]
	}, function(err, res) {
		cb();
	});
};