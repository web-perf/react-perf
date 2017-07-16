var debug = require('debug')('pj:apphelper');

import path from 'path';
import { fork } from 'child_process';

import request from 'request';

export const killServer = async (server) => new Promise((resolve, reject) => {
  server.on('exit', resolve);
  server.on('error', reject);
  debug('🗡️  Stopping Server');
  server.kill('SIGHUP');
});

/**
 * Starts the server at the given path, and waits till the server is ready
 * @param {*} path 
 */
export function startServer(version, appFolder, opts) {
  let { retries, url, sleepTime } = { retries: 5, sleepTime: 3000, url: 'http://localhost:8080', ...opts };
  return new Promise(async (resolve, reject) => {
    debug(`🌐  Starting server for ${version}`);
    let server = fork(path.join(appFolder, 'server.js'), [version], {
      cwd: appFolder
    });
    for (var i = 0; i < retries; i++) {
      let body = await (new Promise((resolve, reject) => request(url, (err, resp, body) => resolve(err ? null : body))));
      if (body) {
        debug(`📡  Server started for ${version}`);
        resolve(server);
        break;
      }
      await sleep(sleepTime);
    }
    if (i >= retries) {
      await killServer(server);
      reject('Exceeded number of retries');
    }
    server.on('error', reject);
  });
}

const sleep = duration => new Promise((resolve, reject) => setTimeout(resolve, duration));
