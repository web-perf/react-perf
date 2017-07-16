var path = require('path');
var fs = require('fs');
var exec = require('child_process').exec;
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
	exec('npm install react@' + version + ' react-dom@' + version, {
		cwd: path.join(__dirname, '..')
	}, function (err, stdout, stderr) {
		if (err) {
			console.log(err, stderr);
			process.exit(1);
		} else {
			cb()
		}
	})
}

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
			new webpack.NoErrorsPlugin(),
			new webpack.DefinePlugin({
				"process.env": {
					NODE_ENV: JSON.stringify("production")
				}
			})
		]
	}, function(err, res) {
		cb();
	});
};