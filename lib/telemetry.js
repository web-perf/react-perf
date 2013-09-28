var fs = require('fs');

module.exports = (function() {
	var express = require('express');
	var app = express();

	/**
	 * Takes a page component and runs it with telemetry
	 **/

	function telemetryPage(page) {
		var pageScripts = ['\n<script type = "text/javascript">\n'];
		['smoothness_measurement.js', 'scroll.js', 'benchmarks.js'].forEach(function(file) {
			pageScripts.push(fs.readFileSync('lib/page_scripts/' + file, 'utf-8'));
		});
		pageScripts.push('</script>');

		var html = fs.readFileSync(page, 'utf-8');

		html.replace()

		if (html.match(/<head>/)) {
			html = html.replace(/<head>/, '<head>' + pageScripts.join(''));
		} else if (html.match(/<body>/)) {
			html = html.replace(/<body>/, '<body>' + pageScripts.join(''));
		} else if (html.match(/<html >/)) {
			html = html.replace(/<html>/, '<html>' + pageScripts.join(''));
		} else {
			html = pageScripts.join() + html;
		}

		return html;
	}

	function server(page) {
		app.get('/', function(req, res) {
			res.send(telemetryPage(page));
		});
	}

	function collectData() {
		app.post('/data', function(req, res) {
			console.log(req);
			res.send('');
		});
	}

	function launchBrowsers() {
		console.log("Launching Browsers");
		var launcher = require('browser-launcher');
		launcher(function(err, launch) {
			launch('http://localhost:3000', {
				browser: 'chrome',
			}, function(err, data) {
				//console.log(err, data);
			});
		});
	}

	return {
		serve: function(page) {
			console.log('Serving page at 3000');
			server(page);
			app.listen(3000);
		},

		run: function(page) {
			server(page);
			collectData();
			launchBrowsers();
			app.listen(3000);
		},
	}


}());