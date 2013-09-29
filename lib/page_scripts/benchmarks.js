/**
 Script inserted into the page to collect various benchmarks
**/

'use strict';

(function(window, undefined) {

	var results = {};

	document.addEventListener('DOMContentLoaded', function() {
		// Load Timing from page
		var load_timings = window.performance.timing;
		results['version'] = __VERSION__;
		results['component'] = __COMPONENT__;
		results['load_time_ms'] = load_timings['navigationStart'] - load_timings['loadEventStart'];
		results['dom_content_loaded_time_ms'] = load_timings['domContentLoadedEventStart'] - load_timings['navigationStart'];

		// Smoothness Benchmarks
		var stats = window.__RenderingStats();

		stats.start();
		var action = new __ScrollAction(function() {
			stats.stop();
			var rendering_stats_deltas = stats.getDeltas();
			calcFirstPaintTimeResults(results);
			calcScrollResults(rendering_stats_deltas, results)
			calcTextureUploadResults(rendering_stats_deltas, results)
			calcImageDecodingResults(rendering_stats_deltas, results)
			console.log(results);
			sendData(results);
		});
		window.setTimeout(function() {
			action.start(document.body);
		}, 1000);

	}, true);

	function calcFirstPaintTimeResults(results) {
		results['first_paint'] = null;
		if (typeof window.chrome !== 'undefined') {
			window.webkitRequestAnimationFrame(function() {
				var first_paint_secs = window.chrome.loadTimes().firstPaintTime - window.chrome.loadTimes().startLoadTime;
				results['first_paint'] = first_paint_secs * 1000;
			});
		}
	}

	function calcScrollResults(rendering_stats_deltas, results) {
		var num_frames_sent_to_screen = rendering_stats_deltas['numFramesSentToScreen'];
		var mean_frame_time_seconds = rendering_stats_deltas['totalTimeInSeconds'] / num_frames_sent_to_screen;
		var dropped_percent = rendering_stats_deltas['droppedFrameCount'] / num_frames_sent_to_screen;
		var num_impl_thread_scrolls = rendering_stats_deltas['numImplThreadScrolls'] || 0;
		var num_main_thread_scrolls = rendering_stats_deltas['numMainThreadScrolls'] || 0;
		var percent_impl_scrolled = (num_impl_thread_scrolls + num_main_thread_scrolls) === 0 ? 0 : num_impl_thread_scrolls / (num_impl_thread_scrolls + num_main_thread_scrolls);
		var num_layers = (rendering_stats_deltas['numLayersDrawn'] || 0) / num_frames_sent_to_screen;
		var num_missing_tiles = (rendering_stats_deltas['numMissingTiles'] || 0) / num_frames_sent_to_screen;

		results['mean_frame_time'] = mean_frame_time_seconds * 1000
		results['dropped_percent'] = dropped_percent * 100;
		results['percent_impl_scrolled'] = percent_impl_scrolled * 100;
		results['average_num_layers_drawn'] = num_layers;
		results['average_num_missing_tiles'] = num_missing_tiles;
	}

	function calcTextureUploadResults(rendering_stats_deltas, results) {
		var averageCommitTimeMs = 0;
		if (typeof rendering_stats_deltas['totalCommitCount'] !== 'undefined' && rendering_stats_deltas['totalCommitCount'] !== 0)
			averageCommitTimeMs = 1000 * rendering_stats_deltas['totalCommitTimeInSeconds'] / rendering_stats_deltas['totalCommitCount']

		results['texture_upload_count'] = rendering_stats_deltas['textureUploadCount'] || 0;
		results['total_texture_upload_time'] = rendering_stats_deltas['totalTextureUploadTimeInSeconds'] || 0;
		results['average_commit_time'] = averageCommitTimeMs;
	}

	function calcImageDecodingResults(rendering_stats_deltas, results) {
		var totalDeferredImageDecodeCount = rendering_stats_deltas['totalDeferredImageDecodeCount'] || 0;
		var totalDeferredImageCacheHitCount = rendering_stats_deltas['totalDeferredImageCacheHitCount'] || 0;
		var totalImageGatheringCount = rendering_stats_deltas['totalImageGatheringCount'] || 0;
		var totalDeferredImageDecodeTimeInSeconds = rendering_stats_deltas['totalDeferredImageDecodeTimeInSeconds'] || 0;
		var totalImageGatheringTimeInSeconds = rendering_stats_deltas['totalImageGatheringTimeInSeconds'] || 0;
		var averageImageGatheringTime = totalImageGatheringCount === 0 ? 0 : totalImageGatheringTimeInSeconds * 1000 / totalImageGatheringCount;

		results['total_deferred_image_decode_count'] = totalDeferredImageDecodeCount;
		results['total_image_cache_hit_count'] = totalDeferredImageCacheHitCount;
		results['average_image_gathering_time'] = averageImageGatheringTime;
		results['total_deferred_image_decoding_time'] = totalDeferredImageDecodeTimeInSeconds;
	}

	function sendData(data) {
		var xmlhttp = null;
		if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp = new XMLHttpRequest();
		} else { // code for IE6, IE5
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}

		xmlhttp.open("POST", '/data', true);
		xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		var params = [];
		for (var key in data) {
			params.push(encodeURIComponent(key), '=', encodeURIComponent(data[key]), '&');
		}
		xmlhttp.send(params.join(''));
	}

}(window));