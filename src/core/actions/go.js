const { validateBrowser } = require('../../utils/validate');
const logger = require('../../utils/logger');
const { MESSAGE_TYPE, NAVIGATION_ERR } = require('../../constants');

module.exports = async (state, { args: { direction } }) => {
  const browser = validateBrowser(state);

  if (browser) {
    switch (direction.toLowerCase()) {
      case 'forward': {
        await browser.forward();
        break;
      }
      case 'back': {
        await browser.back();
        break;
      }
      default: {
        return logger.emitLogs({ message: NAVIGATION_ERR, type: MESSAGE_TYPE.ERROR });
      }
    }
  }
};
