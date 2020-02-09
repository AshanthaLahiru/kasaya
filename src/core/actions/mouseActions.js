const { getCrossElements } = require('../../utils/browser/gridFinder');
const { eraseHighlights } = require('../../utils/browser/eraser');
const { findElements } = require('../../utils/browser/elementFinder');
const { buildRegexFromParamString, buildRegexEscapedString } = require('../../utils/buildRegex');
const timeout = require('../../utils/timeout');
const { validateBrowser } = require('../../utils/validate');
const { highlightMatches } = require('../../utils/browser/common');
const logger = require('../../utils/logger');
const store = require('../helpers/dataStore').store();
const { SEARCH_TIME_OUT, MESSAGE_TYPE } = require('../../constants');

module.exports = async (state, {
  click, doubleClick, hover, rightClick, middleClick,
}, {
    args: {
      selector, marker, elementIndex, row, column, rowMarker, columnMarker,
    },
  }) => {
  const browser = validateBrowser(state);

  if (browser) {
    const inputs = { selector, row, column };

    Object.keys(inputs).forEach((key) => {
      if (inputs[key] && inputs[key].match(/^\$(?:\w*)/)) {
        inputs[key] = store.getGlobal(inputs[key]);
      }
    });

    const selectorValue = inputs.selector;
    const rowValue = inputs.row;
    const columnValue = inputs.column;
    const doMouseAction = async (element) => {
      const handles = await browser.getWindowHandles();
      try {
        if (click) {
          await element.moveTo();
          await browser.positionClick();
        } else if (doubleClick) {
          await element.moveTo();
          await browser.positionDoubleClick();
        } else if (hover) {
          await element.moveTo();
        } else if (rightClick) {
          await element.moveTo();
          await element.positionClick(2);
        } else if (middleClick) {
          await element.moveTo();
          await element.positionClick(1);
        }
      } catch (error) {
        return logger.emitLogs({ message: `Cannot perform the mouse action on '${selectorValue}', maybe use 'inspect' to check whether you are clicking on a valid element.`, type: MESSAGE_TYPE.ERROR });
      }
      // wait for a new tab to open
      await timeout(100);
      const handlesAfterAction = await browser.getWindowHandles();
      if (handlesAfterAction.length > handles.length) {
        await browser.switchToWindow(
          handlesAfterAction[handlesAfterAction.length - 1],
        );
      }
    };

    await browser.execute(eraseHighlights);

    if (rowValue && columnValue) {
      const rowText = buildRegexFromParamString(rowValue);
      const columnText = buildRegexFromParamString(columnValue);

      const elementFinderOpts = {
        highlightMatches: false,
        returnMultiple: true,
        innerHTMLOnly: true,
      };

      let resultRow;
      let resultColumn;
      try {
        await browser.waitUntil(async () => {
          resultRow = await browser.execute(
            findElements,
            rowText,
            rowMarker,
            elementFinderOpts.returnMultiple,
            elementFinderOpts.highlightMatches,
            elementFinderOpts.innerHTMLOnly,
          );

          return resultRow.success === true;
        }, 8000);
      } catch (error) {
        logger.emitLogs({ message: SEARCH_TIME_OUT, type: MESSAGE_TYPE.ERROR });
      }

      try {
        await browser.waitUntil(async () => {
          resultColumn = await browser.execute(
            findElements,
            columnText,
            columnMarker,
            elementFinderOpts.returnMultiple,
            elementFinderOpts.highlightMatches,
            elementFinderOpts.innerHTMLOnly,
          );

          return resultColumn.success === true;
        }, 8000);
      } catch (error) {
        logger.emitLogs({ message: SEARCH_TIME_OUT, type: MESSAGE_TYPE.ERROR });
      }

      if (resultRow.success && resultColumn.success && resultRow.targetResults.length > 0 && resultColumn.targetResults.length > 0) {
        const crossElements = await browser.execute(getCrossElements, resultRow.targetResults[0], resultColumn.targetResults[0]);
        if (crossElements.success) {
          if (crossElements.targetResults.length === 1) {
            const element = await browser.$(crossElements.targetResults[0]);
            await doMouseAction(element);
          } else if (crossElements.targetResults.length > 1 && !elementIndex) {
            await browser.execute(highlightMatches, crossElements.targetResults);
            return logger.emitLogs({ message: `We found more than one result matching your search criteria. Specify what you want to click as follows:\n\tclick on row ${rowValue} column ${columnValue} <index>\n`, type: MESSAGE_TYPE.QUESTION });
          } else if (crossElements.targetResults.length > 1 && !Number.isNaN(Number(elementIndex)) && crossElements.targetResults.length > Number(elementIndex)) {
            await browser.execute(eraseHighlights);
            const element = await browser.$(crossElements.targetResults[elementIndex]);
            await doMouseAction(element);
          }
        }
      }
      return;
    }

    let elementFinderOpts = {
      highlightMatches: false,
      returnMultiple: true,
      innerHTMLOnly: false,
    };

    const markerText = buildRegexEscapedString(marker);
    const selectorText = buildRegexFromParamString(selectorValue);

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
        );

        return result.success === true;
      }, 8000);
    } catch (error) {
      logger.emitLogs({ message: SEARCH_TIME_OUT, type: MESSAGE_TYPE.ERROR });
    }

    const {
      success, code, targetResults,
    } = result;
    if (success === false) {
      switch (code) {
        case 'TARGET_NOT_FOUND': {
          return logger.emitLogs({ message: `Could not locate an element matching text "${selectorValue}"`, type: MESSAGE_TYPE.ERROR });
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

    if (targetResults.length === 1) {
      const element = await browser.$(targetResults[0]);
      await doMouseAction(element);
      return;
    } if (targetResults.length > 1 && !Number.isNaN(Number(elementIndex)) && targetResults.length > Number(elementIndex)) {
      const element = await browser.$(targetResults[Number(elementIndex)]);
      await doMouseAction(element);
      return;
    }

    if (marker) {
      logger.emitLogs({ message: `We found more than one result matching your search criteria. Please specify what you want to click as follows:\n\tclick "${selectorValue}" <index> near ${marker}\n`, type: MESSAGE_TYPE.QUESTION });
    } else {
      logger.emitLogs({ message: `We found more than one result matching your search criteria. Please use "near" keyword to limit the search, or specify what you want to click as follows:\n\tclick "${selectorValue}" <index>\n`, type: MESSAGE_TYPE.QUESTION });
    }

    elementFinderOpts = {
      highlightMatches: true,
      returnMultiple: true,
      innerHTMLOnly: false,
    };

    await browser.execute(
      findElements,
      selectorText,
      markerText,
      elementFinderOpts.returnMultiple,
      elementFinderOpts.highlightMatches,
      elementFinderOpts.innerHTMLOnly,
    );
  }
};
