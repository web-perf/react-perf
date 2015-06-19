# Performance Regression tests for React

> [View Test Results](https://axemclion.cloudant.com/react-perf/_design/site/index.html#/summary?pagename=DBMonster&browser=chrome)


## Running the tests

1. Install dependencies using `npm install`
2. Start up CouchDB and [Chromedriver](https://sites.google.com/a/chromium.org/chromedriver/downloads)
3. Run `node .\lib\cli.js` to test all versions of React and store results in the couchdb server
4. To view results, look at `http://<couchdbServer:5984>/<dbname>/_design/site/index.html`

# Other notes

- To update React versions, change the `.\lib\reactVersions.json` file. 
- All other test parameters are located in `.\lib\index.js`
