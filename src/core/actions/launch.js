/* eslint no-param-reassign: "off" */
const webdriverio = require('webdriverio');
const approot = require('app-root-path');
const logger = require('../../utils/logger');
const { MESSAGE_TYPE, BROWSER_LAUNCH_ERR, HEADLESS_MESSAGE } = require('../../constants');

module.exports = async (state, { args: { browserName, extension, isHeadless } }) => {
  const options = {
    sync: true,
    capabilities: {
      browserName,
      'goog:chromeOptions': {
        args: [
          '--disable-infobars',
          '--start-maximized',
          '--window-size=1920,1080',
        ],
      },
    },
    deprecationWarnings: false,
    logLevel: 'silent',
  };

  if (extension) {
    options.capabilities['goog:chromeOptions'].args.push(`--load-extension=${approot.resolve(extension)}`);
  }

  if (isHeadless) {
    options.capabilities['goog:chromeOptions'].args.push('--headless');
    logger.emitLogs({ message: HEADLESS_MESSAGE, type: MESSAGE_TYPE.PROCESSING });
  }

  let browser;
  try {
    browser = await webdriverio.remote(options);
  } catch (err) {
    logger.emitLogs({ message: BROWSER_LAUNCH_ERR, type: MESSAGE_TYPE.ERROR });
  }

  state.browser = browser;
};
