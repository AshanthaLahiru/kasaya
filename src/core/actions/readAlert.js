const { extractParamsFromText } = require('./../../utils/buildRegex');
const store = require('../helpers/dataStore').store();
const { validateBrowser } = require('../../utils/validate');
const logger = require('../../utils/logger');
const { MESSAGE_TYPE, ALERT_READ_ERR, ALERT_HANDLE_ERR } = require('../../constants');

module.exports = async (state, { args: { searchText } }) => {
  const browser = validateBrowser(state);

  if (browser) {
    try {
      const url = await browser.getAlertText();
      const parsedParams = extractParamsFromText(url, searchText);
      const params = Object.keys(parsedParams);
      params.forEach((key) => {
        store.setGlobal({ key, value: parsedParams[key] });
      });
      if (params.length === 0) {
        logger.emitLogs({ message: ALERT_READ_ERR, type: MESSAGE_TYPE.ERROR });
      } else {
        logger.emitLogs({ message: `Read tokens as: "${JSON.stringify(parsedParams)}"`, type: MESSAGE_TYPE.INFO });
      }
    } catch (err) {
      logger.emitLogs({ message: ALERT_HANDLE_ERR, type: MESSAGE_TYPE.ERROR });
    }
  }
};
