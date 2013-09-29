var server = 'http://localhost:5984/';


function getStats(component, metric) {
	return $.Deferred(function(dfd) {
		$.getJSON(server + 'react-perf/_design/data/_view/stats', {
			startkey: JSON.stringify([component, metric]),
			endkey: JSON.stringify([component, metric, {}]),
			group: true
		}).then(function(data) {
			var result = _.map(data.rows, function(obj, index) {
				return [obj.key[2], obj.value.sum / obj.value.count];
			});
			dfd.resolve(result);
		}, dfd.reject);
	});
}

function drawGraph(data, yaxisLabel) {
	$.jqplot("chartDiv", data, {
		// Turns on animatino for all series in this plot.
		animate: true,
		// Will animate plot on calls to plot1.replot({resetAxes:true})
		animateReplot: true,
		series: [],
		axesDefaults: {
			pad: 0
		},
		seriesDefaults: {
			rendererOptions: {
				smooth: true
			},
			lineWidth: 1,
			markerOptions: {
				size: 2,
				style: "circle"
			}
		},
		axes: {
			// These options will set up the x axis like a category axis.
			xaxis: {
				renderer: $.jqplot.CategoryAxisRenderer,
				label: 'Versions',
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				tickRenderer: $.jqplot.CanvasAxisTickRenderer,
				tickOptions: {
					angle: -90,
					mark: 'outside',
					showMark: true,
					showGridline: true,
					markSize: 4,
					show: true,
					showLabel: true,
				},
				showTicks: true, // wether or not to show the tick labels,
				showTickMarks: true,
			},
			yaxis: {
				tickOptions: {},
				rendererOptions: {
					forceTickAt0: false
				},
				label: yaxisLabel || '',
				labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
				tickRenderer: $.jqplot.CanvasAxisTickRenderer
			}
		},
		highlighter: {
			show: true,
			showLabel: true,
			tooltipAxes: 'y',
			sizeAdjust: 7.5,
			tooltipLocation: 'ne'
		}
	});
}

function showModal(title, body) {
	$('.modal .modal-title').html(title);
	$('.modal .modal-body').html(body);
	$('.modal').modal(true);
}