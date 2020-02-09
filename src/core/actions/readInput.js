const { buildRegexFromParamString, buildRegexEscapedString } = require('../../utils/buildRegex');
const { findElements } = require('../../utils/browser/elementFinder');
const { nearestElementFinder } = require('../../utils/browser/nearestElementFinder');
const { validateBrowser } = require('../../utils/validate');
const store = require('../helpers/dataStore').store();
const { eraseHighlights } = require('../../utils/browser/eraser');
const { highlightMatches, getPlaceholder } = require('../../utils/browser/common');
const logger = require('../../utils/logger');
const { SEARCH_TIME_OUT, MESSAGE_TYPE } = require('../../constants');

const selectiveRead = async (state, { isSelector, isTextField, isPlaceholder }, {
  args: {
    selector, marker, elementIndex, destinationVar,
  },
}) => {
  const browser = validateBrowser(state);
  const retrieveInputValue = async (inputElement) => {
    let element = inputElement;
    const tagName = await element.getTagName();
    if (tagName !== 'input') {
      const elementXpath = await browser.execute(nearestElementFinder, element, 'INPUT');
      element = elementXpath ? await browser.$(elementXpath) : null;
    }
    if (element) {
      let value;
      if (isSelector) {
        value = await element.isSelected();
      } else if (isTextField) {
        value = await element.getValue();
      } else if (isPlaceholder) {
        value = await browser.execute(getPlaceholder, element);
      }

      store.setGlobal({ key: destinationVar, value });
      logger.emitLogs({ message: `Read tokens as: "{"${destinationVar.replace('$', '')}":"${value}"}"`, type: MESSAGE_TYPE.INFO });
    }
  };

  const elementFinderOpts = {
    highlightMatches: false,
    returnMultiple: true,
    innerHTMLOnly: false,
  };

  const markerText = buildRegexEscapedString(marker);
  const selectorText = buildRegexFromParamString(selector);
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
        undefined,
        undefined,
        true,
      );

      return result.success === true;
    }, 8000);
  } catch (error) {
    logger.emitLogs({ message: SEARCH_TIME_OUT, type: MESSAGE_TYPE.ERROR });
  }

  const { success, code, targetResults } = result;

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

  if (targetResults.length === 1) {
    const element = await browser.$(targetResults[0]);
    await retrieveInputValue(element);
  } else if (targetResults.length > 1 && !elementIndex) {
    await browser.execute(highlightMatches, targetResults);
    logger.emitLogs({ message: `We found more than one result matching your search criteria. Please specify what you want to read as follows:\n\tread value from "${selector}" field <index> as ${destinationVar}`, type: MESSAGE_TYPE.QUESTION });
  } else if (targetResults.length > 1 && !Number.isNaN(Number(elementIndex)) && targetResults.length > Number(elementIndex)) {
    const element = await browser.$(targetResults[Number(elementIndex)]);
    await retrieveInputValue(element);
  }
};

const activeRead = async (state, {
  args: {
    destinationVar,
  },
}) => {
  const browser = validateBrowser(state);
  const value = await browser.execute(() => document.activeElement.value);

  if ((value || value === '') && destinationVar) {
    store.setGlobal({ key: destinationVar, value });
    logger.emitLogs({ message: `Read tokens as: "{"${destinationVar.replace('$', '')}":"${value}"}"`, type: MESSAGE_TYPE.INFO });
  }
};

module.exports = { activeRead, selectiveRead };
