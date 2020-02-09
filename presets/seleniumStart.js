const selenium = require('selenium-standalone');
const { promisify } = require('util');
const config = require('../config/config.json');

const seleniumStart = promisify(selenium.start);
const messageEmitter = require('../src/utils/messageEmitter');

module.exports = async () => {
  messageEmitter.emitInProgress('Initializing Kasāya...\n');
  return seleniumStart({
    version: config.seleniumVersion,
    drivers: {
      chrome: {
        version: config.drivers.chrome.version,
        arch: process.arch,
      },
      firefox: {
        version: config.drivers.firefox.version,
        arch: process.arch,
      },
    },
  });
};
