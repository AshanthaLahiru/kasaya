const { validateBrowser } = require('../../utils/validate');
const logger = require('../../utils/logger');
const { MESSAGE_TYPE, SEARCH_TIME_OUT } = require('../../constants');
const { buildRegexFromParamString } = require('../../utils/buildRegex');
const { simulateDragDrop } = require('../../utils/browser/common');
const { findElements } = require('../../utils/browser/elementFinder');

module.exports = async (state, {
  args: {
    source, destination, sourceMarker, destinationMarker,
  },
}) => {
  const browser = validateBrowser(state);

  if (browser) {
    const sourceText = buildRegexFromParamString(source);
    const destinationText = buildRegexFromParamString(destination);

    const elementFinderOpts = {
      highlightMatches: false,
      returnMultiple: true,
      innerHTMLOnly: false,
    };

    let sourceResults;
    let destinationResults;
    try {
      await browser.waitUntil(async () => {
        sourceResults = await browser.execute(
          findElements,
          sourceText,
          sourceMarker,
          elementFinderOpts.returnMultiple,
          elementFinderOpts.highlightMatches,
          elementFinderOpts.innerHTMLOnly,
        );

        return sourceResults.success === true;
      }, 8000);
    } catch (error) {
      logger.emitLogs({ message: SEARCH_TIME_OUT, type: MESSAGE_TYPE.ERROR });
    }

    try {
      await browser.waitUntil(async () => {
        destinationResults = await browser.execute(
          findElements,
          destinationText,
          destinationMarker,
          elementFinderOpts.returnMultiple,
          elementFinderOpts.highlightMatches,
          elementFinderOpts.innerHTMLOnly,
        );

        return destinationResults.success === true;
      }, 8000);
    } catch (error) {
      logger.emitLogs({ message: SEARCH_TIME_OUT, type: MESSAGE_TYPE.ERROR });
    }

    /**
     * TODO: select element based on the elementIndex
     */
    if (sourceResults.success && destinationResults.success && sourceResults.targetResults.length > 0 && destinationResults.targetResults.length > 0) {
      const sourceElement = await browser.$(sourceResults.targetResults[0]);
      const destinationElement = await browser.$(destinationResults.targetResults[0]);

      if (sourceElement && destinationElement) {
        try {
          await browser.execute(simulateDragDrop, sourceElement, destinationElement);
        } catch (err) {
          return logger.emitLogs({ message: 'Drag action performed', type: MESSAGE_TYPE.INFO });
        }
      } else {
        return logger.emitLogs({ message: 'Something went wrong', type: MESSAGE_TYPE.ERROR });
      }
    }
  }
};
