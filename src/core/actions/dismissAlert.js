const { validateBrowser } = require('../../utils/validate');
const logger = require('../../utils/logger');
const { MESSAGE_TYPE, ALERT_HANDLE_ERR } = require('../../constants');

module.exports = async (state) => {
  const browser = validateBrowser(state);

  if (browser) {
    try {
      await browser.dismissAlert();
    } catch (err) {
      logger.emitLogs({ message: ALERT_HANDLE_ERR, type: MESSAGE_TYPE.ERROR });
    }
  }
};
