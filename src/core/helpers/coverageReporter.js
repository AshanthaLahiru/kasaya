/* eslint no-param-reassign: "off" */
const istanbulLibCoverage = require('istanbul-lib-coverage');
const istanbulApi = require('istanbul-api');
const path = require('path');
const { validateBrowser } = require('../../utils/validate');
const timeout = require('../../utils/timeout');

const fetchCoverage = async (state) => {
  const browser = validateBrowser(state);

  if (browser) {
    const coverageObject = await browser.execute(() => window.__coverage__);
    if (state.coverage) {
      state.coverage.push(coverageObject);
    } else {
      state.coverage = [coverageObject];
    }
  }
};

const generateCoverage = async (coverageArray, coverage, scriptPath) => {
  const coverageMap = istanbulLibCoverage.createCoverageMap();
  // wait till the `command` listener is finished
  await timeout(1000);
  if (coverageArray) {
    coverageArray.forEach((obj) => {
      coverageMap.merge(obj);
    });
    const reporter = istanbulApi.createReporter();
    reporter.dir = path.resolve(`./coverage/${scriptPath}`);

    if (coverage === 'text-summary') {
      reporter.add('text-summary');
    } else if (coverage === 'html') {
      reporter.add('html');
    } else if (coverage === 'json') {
      reporter.add('json');
    } else if (coverage === 'lcov') {
      reporter.add('lcov');
    } else if (coverage === 'lcovonly') {
      reporter.add('lcovonly');
    } else {
      reporter.add('text');
    }
    reporter.write(coverageMap, {});
  }
};

module.exports = { fetchCoverage, generateCoverage };
