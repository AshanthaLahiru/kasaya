const { validateBrowser } = require('../../utils/validate');
const logger = require('../../utils/logger');
const { MESSAGE_TYPE, SWITCH_ERR } = require('../../constants');

module.exports = async (state, { args: { what } }) => {
  const browser = validateBrowser(state);

  if (browser) {
    switch (what) {
      case 'window':
      case 'tab': {
        const handles = await browser.getWindowHandles();
        const currentWindow = await browser.getWindowHandle();
        const noOfTabs = handles.length;

        if (noOfTabs === 1) {
          return;
        }
        if (currentWindow === handles[0]) {
          await browser.switchToWindow(handles[1]);
          return;
        }

        await browser.switchToWindow(handles[noOfTabs - 2]);
        break;
      }
      default: {
        logger.emitLogs({ message: SWITCH_ERR, type: MESSAGE_TYPE.ERROR });
      }
    }
  }
};
