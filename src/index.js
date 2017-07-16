import fs from 'fs';
import path from 'path';

import semver from 'semver';
import rimraf from 'rimraf';

import { downloadPackage, installPackageDeps } from './prepare';
import { startServer, killServer } from './apphelper';
import runner from './pjrunner';
import reactVersions from './reactVersions';

var debug = require('debug')('pj:index');

const BIN_DIR = path.join(__dirname, '..', 'bin');

/**
 * Test versions of react
 * @param {*} versions - semver of versions to test
 */
export default async function (versionSemvers = ['*'], opts) {
  let versions = getVersions(versionSemvers, reactVersions);
  debug(`Running for versions [${versions.join(', ')}]`);

  rimraf.sync(BIN_DIR);
  fs.mkdirSync(BIN_DIR);

  return versions.map(version => async () => {
    debug(`=========================== ${version} =========================`);
    let app = await downloadPackage(reactVersions[version], BIN_DIR);
    await installPackageDeps(app);
    let server = await startServer(version, app);
    await runner(version, opts);
    await killServer(server);
  }).reduce((acc, curr) => acc.then(curr).catch(console.log.bind(console)), Promise.resolve());
}


/**
 * Returns an array of valid versions for React, given an array of semvers
 * @param {*} versionSemvers 
 */
function getVersions(versionSemvers, reactVersions) {
  return versionSemvers.map(
    versionSemver => Object.keys(reactVersions)
      .filter(reactVersion => semver.satisfies(reactVersion, versionSemver)))
    .reduce((a, b) => a.concat(b), []);
}
