const { when } = require('jest-when');
const uuid = require('uuid/v4');
const store = require('../../../../src/core/helpers/dataStore').store();
const logger = require('../../../../src/utils/logger');
const { getCrossElements } = require('../../../../src/utils/browser/gridFinder');
const { findElements } = require('../../../../src/utils/browser/elementFinder');
const { highlightMatches } = require('../../../../src/utils/browser/common');
const click = require('../../../../src/core/actions/mouseActions');
const { buildRegexFromParamString } = require('../../../../src/utils/buildRegex');
const { eraseHighlights } = require('../../../../src/utils/browser/eraser');
const { MESSAGE_TYPE } = require('../../../../src/constants');

describe('mouse action test suite', () => {
  test('mouse action should trigger the appropriate webdriver.io function if only one element found matching the provided selector when marker and elementIndex parameters are not present', async () => {
    // selector => present
    // marker => not present
    // elementIndex => not present
    // result => one result

    const browserHandlers = [uuid()];
    const element = { moveTo: jest.fn() };
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn().mockResolvedValue({
          success: true,
          targetResults: [uuid()],
        }),
        $: jest.fn().mockResolvedValue(element),
        positionClick: jest.fn(),
        getWindowHandles: jest.fn().mockResolvedValue(browserHandlers),
      },
    };
    logger.emitLogs = jest.fn();
    const selector = uuid();
    const returnMultiple = true;
    const highlightMatch = false;
    const innerHTMLOnly = false;
    const parsedSelector = buildRegexFromParamString(selector);

    await click(state, { click: true }, { args: { selector } });
    expect(state.browser.execute).toHaveBeenCalledWith(eraseHighlights);
    expect(state.browser.execute).toHaveBeenCalledWith(findElements, parsedSelector, undefined, returnMultiple, highlightMatch, innerHTMLOnly);
    expect(element.moveTo).toHaveBeenCalled();
    expect(state.browser.positionClick).toHaveBeenCalled();
  });

  test('mouse action should trigger the appropriate webdriver.io function if only one element found matching the provided selector and elementIndex when marker is not present', async () => {
    // selector => present
    // marker => not present
    // elementIndex => present
    // result => one result

    const browserHandlers = [uuid()];
    const element = { moveTo: jest.fn() };
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn().mockResolvedValue({
          success: true,
          targetResults: [uuid(), uuid(), uuid()],
        }),
        $: jest.fn().mockResolvedValue(element),
        positionClick: jest.fn(),
        getWindowHandles: jest.fn().mockResolvedValue(browserHandlers),
      },
    };
    logger.emitLogs = jest.fn();
    const selector = uuid();
    const elementIndex = 1;
    const returnMultiple = true;
    const highlightMatch = false;
    const innerHTMLOnly = false;
    const parsedSelector = buildRegexFromParamString(selector);

    await click(state, { click: true }, { args: { selector, elementIndex } });
    expect(state.browser.execute).toHaveBeenCalledWith(eraseHighlights);
    expect(state.browser.execute).toHaveBeenCalledWith(findElements, parsedSelector, undefined, returnMultiple, highlightMatch, innerHTMLOnly);
    expect(element.moveTo).toHaveBeenCalled();
    expect(state.browser.positionClick).toHaveBeenCalled();
  });

  test('mouse action (double-click) should trigger the appropriate webdriver.io function if only one element found matching the provided selector and elementIndex when marker is not present', async () => {
    // selector => present
    // marker => not present
    // elementIndex => present
    // result => one result

    const browserHandlers = [uuid()];
    const element = { moveTo: jest.fn() };
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn().mockResolvedValue({
          success: true,
          targetResults: [uuid(), uuid(), uuid()],
        }),
        $: jest.fn().mockResolvedValue(element),
        positionDoubleClick: jest.fn(),
        getWindowHandles: jest.fn().mockResolvedValue(browserHandlers),
      },
    };
    logger.emitLogs = jest.fn();
    const selector = uuid();
    const elementIndex = 1;
    const returnMultiple = true;
    const highlightMatch = false;
    const innerHTMLOnly = false;
    const parsedSelector = buildRegexFromParamString(selector);

    await click(state, { doubleClick: true }, { args: { selector, elementIndex } });
    expect(state.browser.execute).toHaveBeenCalledWith(eraseHighlights);
    expect(state.browser.execute).toHaveBeenCalledWith(findElements, parsedSelector, undefined, returnMultiple, highlightMatch, innerHTMLOnly);
    expect(element.moveTo).toHaveBeenCalled();
    expect(state.browser.positionDoubleClick).toHaveBeenCalled();
  });

  test('mouse action (hover) should trigger the appropriate webdriver.io function if only one element found matching the provided selector and elementIndex when marker is not present', async () => {
    // selector => present
    // marker => not present
    // elementIndex => present
    // result => one result

    const browserHandlers = [uuid()];
    const element = { moveTo: jest.fn() };
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn().mockResolvedValue({
          success: true,
          targetResults: [uuid(), uuid(), uuid()],
        }),
        $: jest.fn().mockResolvedValue(element),
        getWindowHandles: jest.fn().mockResolvedValue(browserHandlers),
      },
    };
    logger.emitLogs = jest.fn();
    const selector = uuid();
    const elementIndex = 1;
    const returnMultiple = true;
    const highlightMatch = false;
    const innerHTMLOnly = false;
    const parsedSelector = buildRegexFromParamString(selector);

    await click(state, { hover: true }, { args: { selector, elementIndex } });
    expect(state.browser.execute).toHaveBeenCalledWith(eraseHighlights);
    expect(state.browser.execute).toHaveBeenCalledWith(findElements, parsedSelector, undefined, returnMultiple, highlightMatch, innerHTMLOnly);
    expect(element.moveTo).toHaveBeenCalled();
  });

  test('mouse action (right-click) should trigger the appropriate webdriver.io function if only one element found matching the provided selector and elementIndex when marker is not present', async () => {
    // selector => present
    // marker => not present
    // elementIndex => present
    // result => one result

    const browserHandlers = [uuid()];
    const element = { moveTo: jest.fn(), positionClick: jest.fn() };
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn().mockResolvedValue({
          success: true,
          targetResults: [uuid(), uuid(), uuid()],
        }),
        $: jest.fn().mockResolvedValue(element),
        positionClick: jest.fn(),
        getWindowHandles: jest.fn().mockResolvedValue(browserHandlers),
      },
    };
    logger.emitLogs = jest.fn();
    const selector = uuid();
    const elementIndex = 1;
    const returnMultiple = true;
    const highlightMatch = false;
    const innerHTMLOnly = false;
    const parsedSelector = buildRegexFromParamString(selector);

    await click(state, { rightClick: true }, { args: { selector, elementIndex } });
    expect(state.browser.execute).toHaveBeenCalledWith(eraseHighlights);
    expect(state.browser.execute).toHaveBeenCalledWith(findElements, parsedSelector, undefined, returnMultiple, highlightMatch, innerHTMLOnly);
    expect(element.moveTo).toHaveBeenCalled();
    expect(element.positionClick).toHaveBeenCalledWith(2);
  });

  test('mouse action (middle-click) should trigger the appropriate webdriver.io function if only one element found matching the provided selector and elementIndex when marker is not present', async () => {
    // selector => present
    // marker => not present
    // elementIndex => present
    // result => one result

    const browserHandlers = [uuid()];
    const element = { moveTo: jest.fn(), positionClick: jest.fn() };
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn().mockResolvedValue({
          success: true,
          targetResults: [uuid(), uuid(), uuid()],
        }),
        $: jest.fn().mockResolvedValue(element),
        positionClick: jest.fn(),
        getWindowHandles: jest.fn().mockResolvedValue(browserHandlers),
      },
    };
    logger.emitLogs = jest.fn();
    const selector = uuid();
    const elementIndex = 1;
    const returnMultiple = true;
    const highlightMatch = false;
    const innerHTMLOnly = false;
    const parsedSelector = buildRegexFromParamString(selector);

    await click(state, { middleClick: true }, { args: { selector, elementIndex } });
    expect(state.browser.execute).toHaveBeenCalledWith(eraseHighlights);
    expect(state.browser.execute).toHaveBeenCalledWith(findElements, parsedSelector, undefined, returnMultiple, highlightMatch, innerHTMLOnly);
    expect(element.moveTo).toHaveBeenCalled();
    expect(element.positionClick).toHaveBeenCalledWith(1);
  });

  test('mouse action should log an error message and return if no elements found matching the provided selector when marker and elementIndex parameters are not present', async () => {
    // selector => present
    // marker => not present
    // elementIndex => not present
    // result => no elements

    const browserHandlers = [uuid()];
    const element = { moveTo: jest.fn() };
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn().mockResolvedValue({
          success: false,
          code: 'TARGET_NOT_FOUND',
        }),
        $: jest.fn().mockResolvedValue(element),
        positionClick: jest.fn(),
        getWindowHandles: jest.fn().mockResolvedValue(browserHandlers),
      },
    };
    logger.emitLogs = jest.fn();
    const selector = uuid();
    const returnMultiple = true;
    const highlightMatch = false;
    const innerHTMLOnly = false;
    const parsedSelector = buildRegexFromParamString(selector);

    await click(state, { click: true }, { args: { selector } });
    expect(state.browser.execute).toHaveBeenCalledWith(eraseHighlights);
    expect(state.browser.execute).toHaveBeenCalledWith(findElements, parsedSelector, undefined, returnMultiple, highlightMatch, innerHTMLOnly);
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: `Could not locate an element matching text "${selector}"`, type: MESSAGE_TYPE.ERROR });
  });

  test('mouse action should log a specific question and return if more than one elements found matching the provided selector when marker and elementIndex parameters are not present', async () => {
    // selector => present
    // marker => not present
    // elementIndex => not present
    // result => multiple elements

    const browserHandlers = [uuid()];
    const element = { moveTo: jest.fn() };
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn().mockResolvedValue({
          success: true,
          targetResults: [uuid(), uuid(), uuid()],
        }),
        $: jest.fn().mockResolvedValue(element),
        positionClick: jest.fn(),
        getWindowHandles: jest.fn().mockResolvedValue(browserHandlers),
      },
    };
    logger.emitLogs = jest.fn();
    const selector = uuid();
    const returnMultiple = true;
    const highlightMatch = false;
    const innerHTMLOnly = false;
    const parsedSelector = buildRegexFromParamString(selector);

    await click(state, { click: true }, { args: { selector } });
    expect(state.browser.execute).toHaveBeenCalledWith(eraseHighlights);
    expect(state.browser.execute).toHaveBeenCalledWith(findElements, parsedSelector, undefined, returnMultiple, highlightMatch, innerHTMLOnly);
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: `We found more than one result matching your search criteria. Please use "near" keyword to limit the search, or specify what you want to click as follows:\n\tclick "${selector}" <index>\n`, type: MESSAGE_TYPE.QUESTION });
  });

  test('mouse action should log a specific question and return if more than one elements found matching the provided selector and marker, when elementIndex is not present', async () => {
    // selector => present
    // marker => present
    // elementIndex => not present
    // result => multiple elements

    const browserHandlers = [uuid()];
    const element = { moveTo: jest.fn() };
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn().mockResolvedValue({
          success: true,
          targetResults: [uuid(), uuid(), uuid()],
        }),
        $: jest.fn().mockResolvedValue(element),
        positionClick: jest.fn(),
        getWindowHandles: jest.fn().mockResolvedValue(browserHandlers),
      },
    };
    logger.emitLogs = jest.fn();
    const selector = uuid();
    const marker = uuid();
    const returnMultiple = true;
    const highlightMatch = false;
    const innerHTMLOnly = false;
    const parsedSelector = buildRegexFromParamString(selector);
    const parsedMarker = buildRegexFromParamString(marker);

    await click(state, { click: true }, { args: { selector, marker } });
    expect(state.browser.execute).toHaveBeenCalledWith(eraseHighlights);
    expect(state.browser.execute).toHaveBeenCalledWith(findElements, parsedSelector, parsedMarker, returnMultiple, highlightMatch, innerHTMLOnly);
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: `We found more than one result matching your search criteria. Please specify what you want to click as follows:\n\tclick "${selector}" <index> near ${marker}\n`, type: MESSAGE_TYPE.QUESTION });
  });

  test('mouse action should log a specific error and return if more than one marker elements found matching the provided marker', async () => {
    // selector => present
    // marker => present
    // elementIndex => not present
    // result => no element (multiple elements matching marker)

    const browserHandlers = [uuid()];
    const element = { moveTo: jest.fn() };
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn().mockResolvedValue({
          success: false,
          code: 'MULTIPLE_BASE_ELEMENTS',
        }),
        $: jest.fn().mockResolvedValue(element),
        positionClick: jest.fn(),
        getWindowHandles: jest.fn().mockResolvedValue(browserHandlers),
      },
    };
    logger.emitLogs = jest.fn();
    const selector = uuid();
    const marker = uuid();
    const returnMultiple = true;
    const highlightMatch = false;
    const innerHTMLOnly = false;
    const parsedSelector = buildRegexFromParamString(selector);
    const parsedMarker = buildRegexFromParamString(marker);

    await click(state, { click: true }, { args: { selector, marker } });
    expect(state.browser.execute).toHaveBeenCalledWith(eraseHighlights);
    expect(state.browser.execute).toHaveBeenCalledWith(findElements, parsedSelector, parsedMarker, returnMultiple, highlightMatch, innerHTMLOnly);
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: `Found more than one elements matching text "${marker}". Try using a unique text after 'near' keyword.`, type: MESSAGE_TYPE.ERROR });
  });

  // test('mouse action should log xpaths of all the elements found matching the marker text if multiple markers found and the DEV_MODE env variable is set to 1', async () => {
  //     // selector => present
  //     // marker => present
  //     // elementIndex => not present
  //     // result => no element (multiple elements matching marker)
  // });

  test('mouse action should log a specific error and return if no marker elements found matching the provided marker', async () => {
    // selector => present
    // marker => present
    // elementIndex => not present
    // result => no element (no elements matching marker)

    const browserHandlers = [uuid()];
    const element = { moveTo: jest.fn() };
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn().mockResolvedValue({
          success: false,
          code: 'BASE_ELEMENT_NOT_FOUND',
        }),
        $: jest.fn().mockResolvedValue(element),
        positionClick: jest.fn(),
        getWindowHandles: jest.fn().mockResolvedValue(browserHandlers),
      },
    };
    logger.emitLogs = jest.fn();
    const selector = uuid();
    const marker = uuid();
    const returnMultiple = true;
    const highlightMatch = false;
    const innerHTMLOnly = false;
    const parsedSelector = buildRegexFromParamString(selector);
    const parsedMarker = buildRegexFromParamString(marker);

    await click(state, { click: true }, { args: { selector, marker } });
    expect(state.browser.execute).toHaveBeenCalledWith(eraseHighlights);
    expect(state.browser.execute).toHaveBeenCalledWith(findElements, parsedSelector, parsedMarker, returnMultiple, highlightMatch, innerHTMLOnly);
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: `Could not locate an element matching text "${marker}"`, type: MESSAGE_TYPE.ERROR });
  });

  test('mouse action should log a specific error message if the target element could not be found due to an unknown reason', async () => {
    const browserHandlers = [uuid()];
    const element = { moveTo: jest.fn() };
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn().mockResolvedValue({
          success: false,
          code: 'UNKNOWN_ERROR',
        }),
        $: jest.fn().mockResolvedValue(element),
        positionClick: jest.fn(),
        getWindowHandles: jest.fn().mockResolvedValue(browserHandlers),
      },
    };
    logger.emitLogs = jest.fn();
    const selector = uuid();
    const marker = uuid();
    const returnMultiple = true;
    const highlightMatch = false;
    const innerHTMLOnly = false;
    const parsedSelector = buildRegexFromParamString(selector);
    const parsedMarker = buildRegexFromParamString(marker);

    await click(state, { click: true }, { args: { selector, marker } });
    expect(state.browser.execute).toHaveBeenCalledWith(eraseHighlights);
    expect(state.browser.execute).toHaveBeenCalledWith(findElements, parsedSelector, parsedMarker, returnMultiple, highlightMatch, innerHTMLOnly);
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: 'Could not locate your element due to an unknown reason', type: MESSAGE_TYPE.ERROR });
  });

  // test('mouse action should log the xpath(s) of the element(s) which was/were identified by the element finder when the DEV_MODE env variable is set to 1', async () => {
  // });

  // test('mouse action should log the score returned from the element finder if exactly one element was found matching the search criteria, and the DEV_MODE env variable is set to "1"', async () => {
  // });

  test('mouse action should switch to the new tab, if the click opens a new tab', async () => {
    const element = { moveTo: jest.fn() };
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn().mockResolvedValue({
          success: true,
          targetResults: [uuid()],
        }),
        $: jest.fn().mockResolvedValue(element),
        positionClick: jest.fn(),
        getWindowHandles: jest.fn(),
        switchToWindow: jest.fn(),
      },
    };
    logger.emitLogs = jest.fn();
    const selector = uuid();
    const returnMultiple = true;
    const highlightMatch = false;
    const innerHTMLOnly = false;
    const parsedSelector = buildRegexFromParamString(selector);
    state.browser.getWindowHandles.mockResolvedValueOnce([uuid()]).mockResolvedValueOnce([uuid(), uuid()]);

    await click(state, { click: true }, { args: { selector } });
    expect(state.browser.execute).toHaveBeenCalledWith(eraseHighlights);
    expect(state.browser.execute).toHaveBeenCalledWith(findElements, parsedSelector, undefined, returnMultiple, highlightMatch, innerHTMLOnly);
    expect(element.moveTo).toHaveBeenCalled();
    expect(state.browser.switchToWindow).toHaveBeenCalled();
  });

  test('mouse actions should click on element by row column selection', async () => {
    const element = { moveTo: jest.fn() };
    const browserHandlers = [uuid()];
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn(),
        $: jest.fn().mockResolvedValue(element),
        getElementText: jest.fn().mockResolvedValue(uuid()),
        getWindowHandles: jest.fn().mockResolvedValue(browserHandlers),
        positionClick: jest.fn(),
      },
    };
    logger.emitLogs = jest.fn();
    store.setGlobal = jest.fn();
    const rowText = 'row_text';
    const columnText = 'column_text';
    const rowXpath = [uuid()];
    const columnXpath = [uuid()];
    const crossElementXpaths = [uuid()];
    when(state.browser.execute).calledWith(findElements, rowText, undefined, true, false, true).mockResolvedValue({ success: true, targetResults: rowXpath });
    when(state.browser.execute).calledWith(findElements, columnText, undefined, true, false, true).mockResolvedValue({ success: true, targetResults: columnXpath });
    when(state.browser.execute).calledWith(getCrossElements, rowXpath[0], columnXpath[0]).mockResolvedValue({ success: true, targetResults: crossElementXpaths });

    await click(state, { click: true }, { args: { row: rowText, column: columnText } });
    expect(element.moveTo).toHaveBeenCalled();
    expect(state.browser.positionClick).toHaveBeenCalled();
  });

  test('mouse actions should log a request to enter index to click on element by row column selection', async () => {
    const element = { moveTo: jest.fn() };
    const browserHandlers = [uuid()];
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn(),
        $: jest.fn().mockResolvedValue(element),
        getElementText: jest.fn().mockResolvedValue(uuid()),
        getWindowHandles: jest.fn().mockResolvedValue(browserHandlers),
        positionClick: jest.fn(),
      },
    };
    logger.emitLogs = jest.fn();
    store.setGlobal = jest.fn();
    const rowText = 'row_text';
    const columnText = 'column_text';
    const rowXpath = [uuid()];
    const columnXpath = [uuid()];
    const crossElementXpaths = [uuid(), uuid()];
    when(state.browser.execute).calledWith(findElements, rowText, undefined, true, false, true).mockResolvedValue({ success: true, targetResults: rowXpath });
    when(state.browser.execute).calledWith(findElements, columnText, undefined, true, false, true).mockResolvedValue({ success: true, targetResults: columnXpath });
    when(state.browser.execute).calledWith(getCrossElements, rowXpath[0], columnXpath[0]).mockResolvedValue({ success: true, targetResults: crossElementXpaths });

    await click(state, { click: true }, { args: { row: rowText, column: columnText } });
    expect(state.browser.execute).toHaveBeenCalledWith(highlightMatches, crossElementXpaths);
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: `We found more than one result matching your search criteria. Specify what you want to click as follows:\n\tclick on row ${rowText} column ${columnText} <index>\n`, type: MESSAGE_TYPE.QUESTION });
  });

  test('mouse actions should click on element by row column selection when index is provided', async () => {
    const element = { moveTo: jest.fn() };
    const browserHandlers = [uuid()];
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn(),
        $: jest.fn().mockResolvedValue(element),
        getElementText: jest.fn().mockResolvedValue(uuid()),
        getWindowHandles: jest.fn().mockResolvedValue(browserHandlers),
        positionClick: jest.fn(),
      },
    };
    logger.emitLogs = jest.fn();
    store.setGlobal = jest.fn();
    const rowText = 'row_text';
    const columnText = 'column_text';
    const rowXpath = [uuid()];
    const columnXpath = [uuid()];
    const crossElementXpaths = [uuid(), uuid()];
    when(state.browser.execute).calledWith(findElements, rowText, undefined, true, false, true).mockResolvedValue({ success: true, targetResults: rowXpath });
    when(state.browser.execute).calledWith(findElements, columnText, undefined, true, false, true).mockResolvedValue({ success: true, targetResults: columnXpath });
    when(state.browser.execute).calledWith(getCrossElements, rowXpath[0], columnXpath[0]).mockResolvedValue({ success: true, targetResults: crossElementXpaths });

    await click(state, { click: true }, { args: { row: rowText, column: columnText, elementIndex: 1 } });
    expect(element.moveTo).toHaveBeenCalled();
    expect(state.browser.positionClick).toHaveBeenCalled();
  });

  test('mouse actions should click on values fetched from variables', async () => {
    // selector => present
    // marker => not present
    // elementIndex => not present
    // result => one result
    const storeKey = `$${uuid()}`;
    const valueInStore = uuid();
    const browserHandlers = [uuid()];
    const element = { moveTo: jest.fn() };
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn().mockResolvedValue({
          success: true,
          targetResults: [valueInStore],
        }),
        $: jest.fn().mockResolvedValue(element),
        positionClick: jest.fn(),
        getWindowHandles: jest.fn().mockResolvedValue(browserHandlers),
      },
    };
    store.getGlobal = jest.fn();
    logger.emitLogs = jest.fn();
    when(store.getGlobal).calledWith(storeKey).mockReturnValue(valueInStore);

    const selector = storeKey;
    const returnMultiple = true;
    const highlightMatch = false;
    const innerHTMLOnly = false;
    const parsedSelector = buildRegexFromParamString(valueInStore);

    await click(state, { click: true }, { args: { selector } });
    expect(state.browser.execute).toHaveBeenCalledWith(eraseHighlights);
    expect(state.browser.execute).toHaveBeenCalledWith(findElements, parsedSelector, undefined, returnMultiple, highlightMatch, innerHTMLOnly);
    expect(element.moveTo).toHaveBeenCalled();
    expect(state.browser.positionClick).toHaveBeenCalled();
  });
});
