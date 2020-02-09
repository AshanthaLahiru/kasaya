#!/usr/bin/env node
/* eslint no-console: "off" */

const selenium = require('selenium-standalone');
const chalk = require('chalk');
const { promisify } = require('util');
const config = require('../config/config.json');

const installDrivers = promisify(selenium.install);

(async () => {
  try {
    console.log('installing selenium and browser drivers. please wait...');
    await installDrivers({
      // check for more recent versions of selenium here:
      // https://selenium-release.storage.googleapis.com/index.html
      version: config.seleniumVersion,
      baseURL: 'https://selenium-release.storage.googleapis.com',
      drivers: {
        chrome: {
          // check for more recent versions of chrome driver here:
          // https://chromedriver.storage.googleapis.com/index.html
          version: config.drivers.chrome.version,
          arch: process.arch,
          baseURL: 'https://chromedriver.storage.googleapis.com',
        },
        firefox: {
          // check for more recent versions of chrome driver here:
          // https://github.com/mozilla/geckodriver/releases
          version: config.drivers.firefox.version,
          arch: process.arch,
          baseURL: 'https://github.com/mozilla/geckodriver/releases/download',
        },
      },
      requestOpts: {
        // see https://github.com/request/request#requestoptions-callback
        timeout: 10000,
      },
    });
    console.log('installation is complete');
  } catch (e) {
    console.log(
      chalk.red('Error while setting up Selenium or Browser driver:', e.message),
    );
    process.exit(-1);
  }
})();
