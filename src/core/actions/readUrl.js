const { extractParamsFromText } = require('./../../utils/buildRegex');
const store = require('../helpers/dataStore').store();
const { validateBrowser } = require('../../utils/validate');
const { isPageLoaded } = require('../../utils/browser/common');
const logger = require('../../utils/logger');
const { MESSAGE_TYPE, URL_READ_ERR, BROWSER_LOAD_ERR } = require('../../constants');

module.exports = async (state, { args: { searchText } }) => {
  const browser = validateBrowser(state);

  if (browser) {
    try {
      await browser.waitUntil(() => browser.execute(isPageLoaded), 10000);
    } catch (error) {
      logger.emitLogs({ message: BROWSER_LOAD_ERR, type: MESSAGE_TYPE.ERROR });
    }
    const url = await browser.getUrl();
    const parsedParams = extractParamsFromText(url, searchText);
    const params = Object.keys(parsedParams);
    params.forEach((key) => {
      store.setGlobal({ key, value: parsedParams[key] });
    });
    if (params.length === 0) {
      logger.emitLogs({ message: URL_READ_ERR, type: MESSAGE_TYPE.ERROR });
    } else {
      logger.emitLogs({ message: `Read tokens as: "${JSON.stringify(parsedParams)}"`, type: MESSAGE_TYPE.INFO });
    }
  }
};
