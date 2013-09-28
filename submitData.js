if (process.argv.length !== 3) {
	console.log('Usage: %s %s', process.argv[1], process.argv[2]);
	return;
}
var setId = require('node-uuid').v1();
require('csv')().from.path(process.argv[2], {
	columns: true
}).to.array(function(data, count) {
	var db = require('nano')('http://localhost:5984/bootstrap-perf');
	db.bulk({
		docs: data
	}, {
		new_edits: true
	}, function(err, response) {
		if (err) {
			console.log(err);
		} else {
			if (response.length === count) {
				console.log(count + " records saved to http://axemclion.iriscouch.com/_utils/database.html?bootstrap-perf");
			}
		}
	});

}).transform(function(row, index) {
	if (row.url === '\n') {
		return null;
	} else {
		var parts = row.url.trim().split(/\//);
		row.component = parts[1].split(/.html/)[0];
		row.version = parts[0].substring(1);
		row.set = setId
		return row;
	}
})