const { validateBrowser } = require('../../utils/validate');
const logger = require('../../utils/logger');
const { BROWSER_DETACHED_ERR, MESSAGE_TYPE } = require('../../constants');

module.exports = async (state) => {
  const browser = validateBrowser(state);

  if (browser) {
    try {
      await browser.deleteSession();
    } catch (err) {
      logger.emitLogs({ message: BROWSER_DETACHED_ERR, type: MESSAGE_TYPE.ERROR });
    }
  }

  process.exit(0);
};
