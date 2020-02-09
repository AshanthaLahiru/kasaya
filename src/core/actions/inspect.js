const format = require('xml-formatter');
const { waitForElementPick } = require('../../utils/browser/elementPicker');
const { eraseHighlights } = require('../../utils/browser/eraser');
const { validateBrowser } = require('../../utils/validate');
const logger = require('../../utils/logger');
const { MESSAGE_TYPE, INSPECT_ERR } = require('../../constants');

module.exports = async (state) => {
  const browser = validateBrowser(state);

  if (browser) {
    logger.emitLogs({ message: 'Click the element whose DOM structure you want to view', type: MESSAGE_TYPE.QUESTION });
    const value = await browser.executeAsync(waitForElementPick);
    await browser.execute(eraseHighlights);

    if (value) {
      const element = await browser.$(value);
      const htmlContent = await element.getHTML();
      try {
        return logger.emitLogs({ message: `\n${format(htmlContent)}\n`, type: MESSAGE_TYPE.PLAIN });
      } catch (err) {
        return logger.emitLogs({ message: `\n${htmlContent}\n`, type: MESSAGE_TYPE.PLAIN });
      }
    } else {
      return logger.emitLogs({ message: INSPECT_ERR, type: MESSAGE_TYPE.ERROR });
    }
  }
};
