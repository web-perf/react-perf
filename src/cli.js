#!/usr/bin/env node

import minimist from 'minimist';

import App from './index';

let argv = minimist(process.argv.slice(2));
App((!Array.isArray(argv._) || argv._.length === 0) ? undefined : argv._).then(r => {
  console.log('=============');
  console.log(r ? r : '');
}, console.error.bind(console));