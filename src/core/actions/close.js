/* eslint no-param-reassign: "off" */
const { argv } = require('yargs');
const { CLOSE_ERR, MESSAGE_TYPE } = require('../../constants');
const logger = require('../../utils/logger');
const { validateBrowser } = require('../../utils/validate');
const { generateCoverage } = require('../helpers/coverageReporter');

module.exports = async (state, { args: { what } }) => {
  const browser = validateBrowser(state);

  if (browser) {
    switch (what) {
      case 'window': {
        const { coverage, _ } = argv;
        // _[0] referring to script path
        if (coverage && _ && _[0] && state && state.coverage) {
          await generateCoverage(state.coverage, coverage, _[0]);
        }

        await browser.deleteSession();
        delete state.browser;
        return;
      }
      case 'tab': {
        let handles = await browser.getWindowHandles();
        if (handles.length === 1) {
          await browser.deleteSession();
          delete state.browser;
        } else {
          await browser.closeWindow();
          handles = await browser.getWindowHandles();
          await browser.switchToWindow(handles[0]);
        }
        return;
      }
      default: {
        return logger.emitLogs({ message: CLOSE_ERR, type: MESSAGE_TYPE.ERROR });
      }
    }
  }
};
