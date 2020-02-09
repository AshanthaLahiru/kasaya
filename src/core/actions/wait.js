const { findElements } = require('../../utils/browser/elementFinder');
const { buildRegexFromParamString, buildRegexEscapedString } = require('../../utils/buildRegex');
const timeout = require('../../utils/timeout');
const { validateBrowser } = require('../../utils/validate');
const logger = require('../../utils/logger');
const { MESSAGE_TYPE, TIME_UNIT_ERR, BROWSER_LOAD_ERR } = require('../../constants');

module.exports = async (state, { args: { time, selector, marker } }) => {
  const browser = validateBrowser(state);

  if (browser) {
    const waitTime = Number(time) * 1000;

    if (!waitTime) {
      return logger.emitLogs({ message: TIME_UNIT_ERR, type: MESSAGE_TYPE.ERROR });
    }
    if (waitTime && !selector) {
      await timeout(waitTime);
      return;
    }

    const elementFinderOpts = {
      highlightMatches: false,
      returnMultiple: true,
      innerHTMLOnly: false,
    };

    const markerText = buildRegexEscapedString(marker);
    const selectorText = buildRegexFromParamString(selector);
    try {
      await browser.waitUntil(async () => {
        const result = await browser.execute(
          findElements,
          selectorText,
          markerText,
          elementFinderOpts.returnMultiple,
          elementFinderOpts.highlightMatches,
          elementFinderOpts.innerHTMLOnly,
        );

        return result.success === true;
      },
      waitTime);
    } catch (error) {
      return logger.emitLogs({ message: BROWSER_LOAD_ERR, type: MESSAGE_TYPE.ERROR });
    }
  }
};
