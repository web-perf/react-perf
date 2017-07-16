import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

import glob from 'glob';
import request from 'request';
import unzip from 'unzip';

var debug = require('debug')('pj:prepare');

/**
 * Given a remote path and a destination downloads the pacakge to a binary directory
 * and extracts its contents
 * Returns an array of folders where the package contents were installed
 * @param {*} path 
 */
export async function downloadPackage(url, binDir) {
  let dest = path.join(binDir, url.replace(/.*\//, ''));

  let downloadPath = await new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) {
      debug(`⚡ Downloaded ${url}`);
      resolve(dest);
      return;
    }
    request(url).pipe(unzip.Extract({ path: dest }))
      .on('close', function (e) {
        debug('💾  Downloaded', url);
        resolve(dest);
      }).on('error', function (e) {
        debug(`⚠️ Error downloading for ${version} from ${url} to ${dest}`);
        reject(e);
      });
  });

  let files = glob.sync('{.,*}/package.json', { cwd: downloadPath });
  if (files.length !== 1) {
    throw new Error(`The zip did not contain only one app. It contained ${files.length}`);
  }
  return path.join(dest, path.dirname(files[0]));
}

export const installPackageDeps = async (dest) => await new Promise((resolve, reject) => {
  if (dest && fs.existsSync(path.join(dest, 'node_modules'))) {
    debug(`⚡ npm install ${dest}`);
    resolve(dest);
    return;
  }
  debug(`📦  npm install ${dest}`);
  exec('npm install', { cwd: dest }, (err, stdout, stderr) => err ? reject(err) : resolve(dest));
});