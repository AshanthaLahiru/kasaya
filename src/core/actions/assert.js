const { get } = require('lodash');
const store = require('../helpers/dataStore').store();
const { eraseHighlights } = require('../../utils/browser/eraser');
const { validateBrowser } = require('../../utils/validate');
const { highlightMatches, isElementDisabledFromStyles } = require('../../utils/browser/common');
const { findElements } = require('../../utils/browser/elementFinder');
const { buildRegexFromParamString, buildRegexEscapedString } = require('../../utils/buildRegex');
const { nearestElementFinder } = require('../../utils/browser/nearestElementFinder');
const logger = require('../../utils/logger');
const {
  ASSERTION, SEARCH_TIME_OUT, MESSAGE_TYPE, BROWSER_ERR,
} = require('../../constants');

const common = async ({ args: { actualVal, expectedVal, notExpectedVal } }) => {
  let actualValue;
  let expectedValue;
  let notExpectedValue;

  if (actualVal.match(/^\$(?:\w*)\[.*?\]/)) {
    const varValue = actualVal.match(/[^[]*/i)[0]; // get everything before the square brackets
    const elementValue = actualVal.substring(actualVal.indexOf('['));
    const matches = elementValue.match(/\[(.*?)\]/g);
    const keys = matches.map((key) => key.replace(/[[\]']+/g, ''));
    const objValue = store.getGlobal(varValue);
    actualValue = get(objValue, keys);
  } else {
    actualValue = store.getGlobal(actualVal);
  }

  if (expectedVal !== undefined && expectedVal.match(/^\$(?:\w*)/)) {
    expectedValue = store.getGlobal(expectedVal);
  } else {
    expectedValue = expectedVal;
  }

  if (notExpectedVal !== undefined && notExpectedVal.match(/^\$(?:\w*)/)) {
    notExpectedValue = store.getGlobal(notExpectedVal);
  } else {
    notExpectedValue = notExpectedVal;
  }

  if (actualValue === expectedValue || (notExpectedValue !== undefined && actualValue !== notExpectedValue)) {
    return logger.emitLogs({ message: ASSERTION.PASS, type: MESSAGE_TYPE.INFO });
  } else {
    return logger.emitLogs({ message: ASSERTION.FAIL, type: MESSAGE_TYPE.INFO });
  }
};

const checkElementStatus = async (state, {
  isEnabled, isSelector, isTextField, isFocused,
}, {
    args: {
      selector, marker, elementIndex, expectedVal,
    },
  }) => {
  const browser = validateBrowser(state);
  const validateInputValue = async (inputElement) => {
    let element = inputElement;
    const tagName = await element.getTagName();

    if (tagName !== 'input') {
      const elementXpath = await browser.execute(nearestElementFinder, element, 'INPUT');
      element = elementXpath ? await browser.$(elementXpath) : null;
    }

    if (element) {
      let value;
      if (isSelector !== undefined) {
        value = await element.isSelected();
      } else {
        value = await element.getValue();
      }

      if ((isSelector === undefined && (expectedVal === value)) || (isSelector === true && value) || (isSelector === false && !value)) {
        return logger.emitLogs({ message: ASSERTION.PASS, type: MESSAGE_TYPE.INFO });
      } else {
        return logger.emitLogs({ message: ASSERTION.FAIL, type: MESSAGE_TYPE.INFO });
      }
    }
  };

  const validateFocusStatus = async (inputElement) => {
    let element = inputElement;
    const tagName = await element.getTagName();
    if (tagName !== 'input') {
      const elementXpath = await browser.execute(nearestElementFinder, element, 'INPUT');
      element = elementXpath ? await browser.$(elementXpath) : null;
    }
    const focusStatus = element ? await element.isFocused() : null;

    if (focusStatus !== null) {
      if ((focusStatus && isFocused) || (!focusStatus && !isFocused)) {
        return logger.emitLogs({ message: ASSERTION.PASS, type: MESSAGE_TYPE.INFO });
      } else {
        return logger.emitLogs({ message: ASSERTION.FAIL, type: MESSAGE_TYPE.INFO });
      }
    }
  };

  const validateEnableStatus = async (inputElement) => {
    const element = inputElement;

    const enableCheck = await element.isEnabled();
    const isDisabledFromStyles = await browser.execute(isElementDisabledFromStyles, element);
    const enableStatus = enableCheck && !isDisabledFromStyles;

    if ((enableStatus && isEnabled) || (!enableStatus && !isEnabled)) {
      return logger.emitLogs({ message: ASSERTION.PASS, type: MESSAGE_TYPE.INFO });
    } else {
      return logger.emitLogs({ message: ASSERTION.FAIL, type: MESSAGE_TYPE.INFO });
    }
  };

  if (browser) {
    if (selector) {
      const elementFinderOpts = {
        highlightMatches: false,
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
            undefined,
            ((isSelector !== undefined || isTextField !== undefined || isFocused !== undefined)),
          );

          return result.success === true;
        },
        5000);
      } catch (error) {
        logger.emitLogs({ message: SEARCH_TIME_OUT, type: MESSAGE_TYPE.ERROR });
      }

      const { success, code, targetResults } = result;

      if (success === false) {
        switch (code) {
          case 'TARGET_NOT_FOUND': {
            return logger.emitLogs({ message: `Element "${selector}" not found on page.`, type: MESSAGE_TYPE.ERROR });
          }
          case 'BASE_ELEMENT_NOT_FOUND': {
            return logger.emitLogs({ message: `Element "${marker}" not found on page.`, type: MESSAGE_TYPE.ERROR });
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
        if (isEnabled !== undefined) {
          return validateEnableStatus(element);
        } else if (isSelector !== undefined || isTextField !== undefined) {
          return validateInputValue(element);
        } else if (isFocused !== undefined) {
          return validateFocusStatus(element);
        }
      } else if (targetResults.length > 1 && elementIndex) {
        const element = await browser.$(targetResults[elementIndex]);
        await browser.execute(eraseHighlights);

        if (isEnabled !== undefined) {
          return validateEnableStatus(element);
        } else if (isSelector !== undefined || isTextField !== undefined) {
          return validateInputValue(element);
        } else if (isFocused !== undefined) {
          return validateFocusStatus(element);
        }
      } else if (targetResults.length > 1 && !elementIndex) {
        await browser.execute(highlightMatches, targetResults);
        return logger.emitLogs({ message: `We found more than one result matching your search criteria. Specify what you want to choose using following format: "${selector}" <index>\n`, type: MESSAGE_TYPE.ERROR });
      }
    }
  }
};

const checkElementAvailability = async (state, { isAvailable }, { args: { selector } }) => {
  const browser = await validateBrowser(state);
  if (browser) {
    if (selector) {
      const elementFinderOpts = {
        highlightMatches: false,
        returnMultiple: true,
        innerHTMLOnly: false,
      };

      const selectorText = buildRegexFromParamString(selector);
      await browser.execute(eraseHighlights);

      let result;

      try {
        await browser.waitUntil(async () => {
          result = await browser.execute(
            findElements,
            selectorText,
            undefined,
            elementFinderOpts.returnMultiple,
            elementFinderOpts.highlightMatches,
            elementFinderOpts.innerHTMLOnly,
          );
          return result.success === true;
        },
        500);
      } catch (error) {
        if (isAvailable) {
          return logger.emitLogs({ message: ASSERTION.FAIL, type: MESSAGE_TYPE.INFO });
        } else {
          return logger.emitLogs({ message: ASSERTION.PASS, type: MESSAGE_TYPE.INFO });
        }
      }

      const { targetResults } = result;

      if (targetResults.length === 1) {
        const element = await browser.$(targetResults[0]);
        // returns true in cases such as when element is not in viewport or with zero opacity
        const isDisplayed = await element.isDisplayed();
        if ((isAvailable && isDisplayed) || (!isAvailable && !isDisplayed)) {
          return logger.emitLogs({ message: ASSERTION.PASS, type: MESSAGE_TYPE.INFO });
        } else {
          return logger.emitLogs({ message: ASSERTION.FAIL, type: MESSAGE_TYPE.INFO });
        }
      }
      if (targetResults.length > 1) {
        // check whether target elements are displayed
        const elements = await Promise.all(targetResults.map((target) => browser.$(target)));
        const displayStatuses = await Promise.all(elements.map((el) => el.isDisplayed()));
        const isDisplayed = displayStatuses.includes(true);
        if ((isAvailable && isDisplayed) || (!isAvailable && !isDisplayed)) {
          return logger.emitLogs({ message: ASSERTION.PASS, type: MESSAGE_TYPE.INFO });
        } else {
          return logger.emitLogs({ message: ASSERTION.FAIL, type: MESSAGE_TYPE.INFO });
        }
      }
    }
  } else {
    return logger.emitLogs({ message: BROWSER_ERR, type: MESSAGE_TYPE.ERROR });
  }
};

module.exports = {
  common,
  checkElementStatus,
  checkElementAvailability,
};
