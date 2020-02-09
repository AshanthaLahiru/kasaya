const store = require('../helpers/dataStore').store();
const Terminal = require('../../utils/terminal');
const {
  buildRegexFromParamString,
  extractParamsFromText,
  buildRegexEscapedString,
} = require('../../utils/buildRegex');
const { waitForElementPick } = require('../../utils/browser/elementPicker');
const { eraseHighlights } = require('../../utils/browser/eraser');
const { findElements } = require('../../utils/browser/elementFinder');
const { getCrossElements } = require('../../utils/browser/gridFinder');
const { validateBrowser } = require('../../utils/validate');
const { getInnerText, highlightMatches } = require('../../utils/browser/common');
const logger = require('../../utils/logger');
const { SEARCH_TIME_OUT, MESSAGE_TYPE, MODES } = require('../../constants');

const readByTemplate = async (state, {
  args: {
    identifier, searchText, marker, index, direction, row, column, rowMarker, columnMarker,
  }, line,
}) => {
  const browser = validateBrowser(state);

  if (browser) {
    const promptPicker = async (prompt, options) => {
      const decision = await Terminal.promptQuestion(prompt, options);

      if (decision === 'y') {
        const value = await browser.executeAsync(waitForElementPick);
        await browser.execute(eraseHighlights);
        const xpathStr = Buffer.from(value, 'utf-8').toString('base64'); // TODO: replace base64 encoded string from an escaped string
        logger.emitLogs({ message: `You selected the following element:  \n\n${xpathStr}\n`, type: MESSAGE_TYPE.INFO });
      }
    };

    await browser.execute(eraseHighlights);

    if (identifier) {
      try {
        const decodedXPath = Buffer.from(identifier, 'base64').toString('utf-8'); // TODO: replace base64 decoded string from an unescaped string
        const element = await browser.$(decodedXPath);
        const innerText = await browser.getElementText(element.elementId);
        const parsedParams = extractParamsFromText(innerText, searchText);
        const paramKeys = Object.keys(parsedParams);
        paramKeys.forEach((key) => {
          store.setGlobal({ key, value: parsedParams[key] });
        });
        if (paramKeys.length > 0) {
          return logger.emitLogs({ message: `Read tokens as: "${JSON.stringify(parsedParams)}"`, type: MESSAGE_TYPE.INFO });
        }
        return logger.emitLogs({ message: 'Could not read parameters from the selected element', type: MESSAGE_TYPE.ERROR });
      } catch (err) {
        return logger.emitLogs({ message: 'Could not locate any element matching the provided identifier.', type: MESSAGE_TYPE.ERROR });
      }
    }

    if (row && column && searchText) {
      const rowText = buildRegexFromParamString(row);
      const columnText = buildRegexFromParamString(column);

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
        if (resultRow.targetResults.length > 1 && !rowMarker) {
          logger.emitLogs({
            message: `We found more than one result matching your 'row' search criteria. Please specify what you want to read as follows:\n\tread "${searchText}" from row "${row}" near <marker> column "${column}"\n\tOR\n\tlookup "${column}" for "${row}" near <marker> as "${searchText}"`,
            type: MESSAGE_TYPE.QUESTION,
          });
          return;
        }
        if (resultColumn.targetResults.length > 1 && !columnMarker) {
          logger.emitLogs({
            message: `We found more than one result matching your 'column' search criteria. Please specify what you want to read as follows:\n\tread "${searchText}" from row "${row}" column "${column}" near <marker>\n\tOR\n\tlookup "${column}" near <marker> for "${row}" as "${searchText}"`,
            type: MESSAGE_TYPE.QUESTION,
          });
          return;
        }
        if ((resultColumn.targetResults.length > 1 && columnMarker) || (resultRow.targetResults.length > 1 && rowMarker)) {
          logger.emitLogs({ message: 'We found more than one result matching your search criteria, please use different marker!', type: MESSAGE_TYPE.QUESTION });
          return;
        }
        const crossElements = await browser.execute(getCrossElements, resultRow.targetResults[0], resultColumn.targetResults[0]);

        let innerTexts;
        try {
          await browser.waitUntil(async () => {
            innerTexts = await browser.execute(getInnerText, crossElements.targetResults);
            return innerTexts.length > 0;
          }, 8000);
        } catch (error) {
          logger.emitLogs({ message: SEARCH_TIME_OUT, type: MESSAGE_TYPE.ERROR });
        }

        if (searchText && innerTexts) {
          const matchedArray = innerTexts.filter((element) => {
            const params = extractParamsFromText(element.innerText, searchText);
            return Object.keys(params).length > 0;
          });

          let parsedParams;
          if (matchedArray && Array.isArray(matchedArray)) {
            if (matchedArray.length > 1 && !index) {
              await browser.execute(highlightMatches, matchedArray.map((element) => element.xpath));
              logger.emitLogs({ message: `We found more than one result matching your search criteria. Please specify what you want to read as follows:\n\t${line.trim()} <index>`, type: MESSAGE_TYPE.QUESTION });
              return;
            }
            if (matchedArray.length >= 1) {
              const innerText = (matchedArray.length > 1 && index && index < matchedArray.length) ? matchedArray[index].innerText : matchedArray[0].innerText;
              parsedParams = extractParamsFromText(innerText, searchText);
            }
          }

          const paramKeys = parsedParams ? Object.keys(parsedParams) : [];
          paramKeys.forEach((key) => {
            store.setGlobal({ key, value: parsedParams[key] });
          });

          if (paramKeys.length > 0) {
            logger.emitLogs({ message: `Read tokens as: "${JSON.stringify(parsedParams)}"`, type: MESSAGE_TYPE.INFO });
          } else {
            logger.emitLogs({ message: 'Could not read parameters from the selected element', type: MESSAGE_TYPE.ERROR });
          }
        }
      }
      return;
    }

    const searchRegexStr = buildRegexFromParamString(searchText);
    const markerText = buildRegexEscapedString(marker);

    let elementFinderOpts = {
      highlightMatches: false,
      returnMultiple: true,
      innerHTMLOnly: true,
      highlightIndex: false,
    };

    let result;
    try {
      await browser.waitUntil(async () => {
        result = await browser.execute(
          findElements,
          searchRegexStr,
          markerText,
          elementFinderOpts.returnMultiple,
          elementFinderOpts.highlightMatches,
          elementFinderOpts.innerHTMLOnly,
          elementFinderOpts.highlightIndex,
          direction,
        );
        return result.success === true;
      }, 8000);
    } catch (err) {
      if (!result) {
        result = { success: false, code: 'TARGET_NOT_FOUND' };
      }
    }

    const { success, code, targetResults } = result;
    const mode = Terminal.getMode();

    if (success === false) {
      switch (code) {
        case 'TARGET_NOT_FOUND':
        case 'BASE_ELEMENT_NOT_FOUND': {
          if (mode === MODES.REPL) {
            await promptPicker('No matching element found. Would you like to point it on the page (y/n): ', { default: 'n' });
            return;
          } else {
            return logger.emitLogs({ message: 'No matching element found.', type: MESSAGE_TYPE.ERROR });
          }
        }
        case 'MULTIPLE_BASE_ELEMENTS': {
          if (mode === MODES.REPL) {
            await promptPicker('No unique element found. Would you like to point it on the page (y/n): ', { default: 'n' });
            return;
          } else {
            return logger.emitLogs({ message: 'No unique element found.', type: MESSAGE_TYPE.ERROR });
          }
        }
        default: {
          if (mode === MODES.REPL) {
            await promptPicker('Could not locate element. Would you like to point it on the page (y/n): ', { default: 'n' });
            return;
          } else {
            return logger.emitLogs({ message: 'Could not locate element.', type: MESSAGE_TYPE.ERROR });
          }
        }
      }
    }

    try {
      if (targetResults.length === 1) {
        const element = await browser.$(targetResults[0]);
        const innerText = await browser.getElementText(element.elementId);
        const parsedParams = extractParamsFromText(innerText, searchText);
        Object.keys(parsedParams).forEach((key) => {
          store.setGlobal({ key, value: parsedParams[key] });
        });
        logger.emitLogs({ message: `Read tokens as: "${JSON.stringify(parsedParams)}"`, type: MESSAGE_TYPE.INFO });
        return;
      } else if (targetResults.length > 1 && !Number.isNaN(Number(index)) && targetResults.length > Number(index)) {
        const element = await browser.$(targetResults[Number(index)]);
        const innerText = await browser.getElementText(element.elementId);
        const parsedParams = extractParamsFromText(innerText, searchText);
        Object.keys(parsedParams).forEach((key) => {
          store.setGlobal({ key, value: parsedParams[key] });
        });
        logger.emitLogs({ message: `Read tokens as: "${JSON.stringify(parsedParams)}"`, type: MESSAGE_TYPE.INFO });
        return;
      }
    } catch (err) {
      if (mode === MODES.REPL) {
        await promptPicker('Could not locate element. Would you like to point it on the page (y/n): ', { default: 'n' });
        return;
      } else {
        return logger.emitLogs({ message: 'Could not locate element.', type: MESSAGE_TYPE.ERROR });
      }
    }

    if (marker) {
      logger.emitLogs({ message: `We found more than one result matching your search criteria. Please specify what you want to read as follows:\n\tread "${searchText}" <index> near ${marker}\n`, type: MESSAGE_TYPE.QUESTION });
    } else {
      logger.emitLogs({ message: `We found more than one result matching your search criteria. Please use "near" keyword to limit the search, or specify what you want to extract as follows:\n\tread "${searchText}" near <marker>\n`, type: MESSAGE_TYPE.QUESTION });
    }

    elementFinderOpts = {
      highlightMatches: true,
      returnMultiple: true,
      innerHTMLOnly: true,
    };

    await browser.execute(
      findElements,
      searchRegexStr,
      markerText,
      elementFinderOpts.returnMultiple,
      elementFinderOpts.highlightMatches,
      elementFinderOpts.innerHTMLOnly,
    );
  }
};

module.exports = {
  readByTemplate,
};
