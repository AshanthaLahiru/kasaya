const { eraseHighlights } = require('../../utils/browser/eraser');
const { findElements } = require('../../utils/browser/elementFinder');
const { buildRegexFromParamString, buildRegexEscapedString } = require('../../utils/buildRegex');
const { validateBrowser } = require('../../utils/validate');
const logger = require('../../utils/logger');
const { SEARCH_TIME_OUT, MESSAGE_TYPE } = require('../../constants');

module.exports = async (state, { args: { selector, marker, elementIndex } }) => {
  const browser = validateBrowser(state);

  if (browser) {
    const elementFinderOpts = {
      highlightMatches: true,
      returnMultiple: true,
      innerHTMLOnly: false,
    };

    const selectorText = buildRegexFromParamString(selector);
    const markerText = buildRegexEscapedString(marker);
    await browser.execute(eraseHighlights);

    let result;
    try {
      await browser.waitUntil(async () => {
        result = await browser.execute(
          findElements,
          selectorText,
          markerText,
          elementFinderOpts.returnMultiple,
          elementFinderOpts.highlightMatches,
          elementFinderOpts.innerHTMLOnly,
          elementIndex,
        );

        return result.success === true;
      },
      8000);
    } catch (error) {
      return logger.emitLogs({ message: SEARCH_TIME_OUT, type: MESSAGE_TYPE.ERROR });
    }

    const {
      success, code,
    } = result;
    if (success === false) {
      switch (code) {
        case 'TARGET_NOT_FOUND': {
          return logger.emitLogs({ message: `Could not locate an element matching text "${selector}"`, type: MESSAGE_TYPE.ERROR });
        }
        case 'BASE_ELEMENT_NOT_FOUND': {
          return logger.emitLogs({ message: `Could not locate an element matching text "${marker}"`, type: MESSAGE_TYPE.ERROR });
        }
        case 'MULTIPLE_BASE_ELEMENTS': {
          return logger.emitLogs({ message: `Found more than one elements matching text "${marker}". Try using a unique text after 'near' keyword.`, type: MESSAGE_TYPE.ERROR });
        }
        default: {
          return logger.emitLogs({ message: 'Could not locate your element due to an unknown reason', type: MESSAGE_TYPE.ERROR });
        }
      }
    }
  }
};
