var fs = require('fs');

module.exports = (function() {
	var express = require('express');
	var app = express();
	app.use(express.bodyParser());
	app.use(express.methodOverride());

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
		app.use('/tests/', express.static(__dirname + '/../tests/'));
		app.get('/', function(req, res) {
			res.send(telemetryPage(page));
		});
	}

	function collectData(page) {
		console.log(page);
		app.post('/data', function(req, res) {
			var data = req.body;
			data['url'] = page;
			var nano = require('nano')('http://localhost:5984');
			nano.use('react-perf').insert(data, function(err, data){
				console.log('Saved data to server', data)
			});
			res.send('');
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
			collectData(page);
			app.listen(3000);
		},
	}


}());