const { eraseHighlights } = require('../../utils/browser/eraser');
const { validateBrowser } = require('../../utils/validate');
const logger = require('../../utils/logger');
const { CLEAR_ERR, MESSAGE_TYPE, ELEMENT_CLEAR_ERR } = require('../../constants');

module.exports = async (state, { args: { what } }) => {
  const browser = validateBrowser(state);

  if (browser) {
    try {
      switch (what) {
        case 'text':
        case 'input': {
          const activeTextBox = await browser.getActiveElement();
          await browser.elementClear(activeTextBox.ELEMENT);
          return;
        }
        case 'highlights': {
          await browser.execute(eraseHighlights);
          return;
        }
        default: {
          return logger.emitLogs({ message: CLEAR_ERR, type: MESSAGE_TYPE.ERROR });
        }
      }
    } catch (err) {
      logger.emitLogs({ message: ELEMENT_CLEAR_ERR, type: MESSAGE_TYPE.ERROR });
    }
  }
};
