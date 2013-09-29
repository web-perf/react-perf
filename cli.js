#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program = require('commander'),
	telemetry = require('./lib/telemetry');

program
	.command('serve [page]')
	.description('Serve telemetry [page]')
	.action(function(env){
		telemetry.serve(env);
	});

program
	.command('run [component]')
	.description('Run telemetry for component [component]')
	.action(function(env){
		telemetry.run(env)
	});

program
	.command('*')
	.description('Run telemetry for component [component]')
	.action(function(env){
		telemetry.run(env)
	});

program
	.version('0.0.1')
	.parse(process.argv);
