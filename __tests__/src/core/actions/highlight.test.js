const uuid = require('uuid/v4');
const highlight = require('../../../../src/core/actions/highlight');
const { findElements } = require('../../../../src/utils/browser/elementFinder');
const { buildRegexFromParamString, buildRegexEscapedString } = require('../../../../src/utils/buildRegex');
const { eraseHighlights } = require('../../../../src/utils/browser/eraser');
const logger = require('../../../../src/utils/logger');
const { MESSAGE_TYPE } = require('../../../../src/constants');

describe('highlight command test suite', () => {
  test('highlight function should highlight element, if only one element found matching the provided selector when marker and elementIndex parameters are not present', async () => {
    // selector => present
    // marker => not present
    // elementIndex => not present
    // result => one result

    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn().mockResolvedValue({
          success: true,
          targetResults: [uuid()],
        }),
      },
    };
    logger.emitLogs = jest.fn();
    const selector = uuid();
    const returnMultiple = true;
    const highlightMatches = true;
    const innerHTMLOnly = false;
    const parsedSelector = buildRegexFromParamString(selector);

    await highlight(state, { args: { selector } });
    expect(state.browser.execute).toHaveBeenCalledWith(eraseHighlights);
    expect(state.browser.execute).toHaveBeenCalledWith(findElements, parsedSelector, undefined, returnMultiple, highlightMatches, innerHTMLOnly, undefined);
    expect(logger.emitLogs).not.toHaveBeenCalled();
  });

  test('highlight function should highlight element, if only one element found matching the provided selector and elementIndex when marker is not present', async () => {
    // selector => present
    // marker => not present
    // elementIndex => present
    // result => one result

    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn().mockResolvedValue({
          success: true,
          targetResults: [uuid()],
        }),
      },
    };
    logger.emitLogs = jest.fn();
    const selector = uuid();
    const elementIndex = uuid();
    const returnMultiple = true;
    const highlightMatches = true;
    const innerHTMLOnly = false;
    const parsedSelector = buildRegexFromParamString(selector);

    await highlight(state, { args: { selector, elementIndex } });
    expect(state.browser.execute).toHaveBeenCalledWith(eraseHighlights);
    expect(state.browser.execute).toHaveBeenCalledWith(findElements, parsedSelector, undefined, returnMultiple, highlightMatches, innerHTMLOnly, elementIndex);
    expect(logger.emitLogs).not.toHaveBeenCalled();
  });

  test('highlight action should log an error message and return if no elements found matching the provided selector when marker and elementIndex parameters are not present', async () => {
    // selector => present
    // marker => not present
    // elementIndex => not present
    // result => no elements

    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn().mockResolvedValue({
          success: false,
          code: 'TARGET_NOT_FOUND',
        }),
      },
    };
    logger.emitLogs = jest.fn();
    const selector = uuid();
    const returnMultiple = true;
    const highlightMatches = true;
    const innerHTMLOnly = false;
    const parsedSelector = buildRegexFromParamString(selector);

    await highlight(state, { args: { selector } });
    expect(state.browser.execute).toHaveBeenCalledWith(eraseHighlights);
    expect(state.browser.execute).toHaveBeenCalledWith(findElements, parsedSelector, undefined, returnMultiple, highlightMatches, innerHTMLOnly, undefined);
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: `Could not locate an element matching text "${selector}"`, type: MESSAGE_TYPE.ERROR });
  });

  test('highlight action should log a specific error and return if no marker elements found matching the provided marker', async () => {
    // selector => present
    // marker => present
    // elementIndex => not present
    // result => no element (no elements matching marker)

    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn().mockResolvedValue({
          success: false,
          code: 'BASE_ELEMENT_NOT_FOUND',
        }),
      },
    };
    logger.emitLogs = jest.fn();
    const selector = uuid();
    const marker = uuid();
    const returnMultiple = true;
    const highlightMatches = true;
    const innerHTMLOnly = false;
    const parsedSelector = buildRegexFromParamString(selector);
    const parsedMarker = buildRegexEscapedString(marker);

    await highlight(state, { args: { selector, marker } });
    expect(state.browser.execute).toHaveBeenCalledWith(eraseHighlights);
    expect(state.browser.execute).toHaveBeenCalledWith(findElements, parsedSelector, parsedMarker, returnMultiple, highlightMatches, innerHTMLOnly, undefined);
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: `Could not locate an element matching text "${marker}"`, type: MESSAGE_TYPE.ERROR });
  });

  test('highlight action should log a specific error and return if more than one marker elements found matching the provided marker', async () => {
    // selector => present
    // marker => present
    // elementIndex => not present
    // result => no element (multiple elements matching marker)

    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn().mockResolvedValue({
          success: false,
          code: 'MULTIPLE_BASE_ELEMENTS',
        }),
      },
    };
    logger.emitLogs = jest.fn();
    const selector = uuid();
    const marker = uuid();
    const returnMultiple = true;
    const highlightMatches = true;
    const innerHTMLOnly = false;
    const parsedSelector = buildRegexFromParamString(selector);
    const parsedMarker = buildRegexEscapedString(marker);

    await highlight(state, { args: { selector, marker } });
    expect(state.browser.execute).toHaveBeenCalledWith(eraseHighlights);
    expect(state.browser.execute).toHaveBeenCalledWith(findElements, parsedSelector, parsedMarker, returnMultiple, highlightMatches, innerHTMLOnly, undefined);
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: `Found more than one elements matching text "${marker}". Try using a unique text after 'near' keyword.`, type: MESSAGE_TYPE.ERROR });
  });

  test('highlight action should log a specific error message if the target element could not be found due to an unknown reason', async () => {
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn().mockResolvedValue({
          success: false,
        }),
      },
    };
    logger.emitLogs = jest.fn();
    const selector = uuid();
    const marker = uuid();
    const returnMultiple = true;
    const highlightMatches = true;
    const innerHTMLOnly = false;
    const parsedSelector = buildRegexFromParamString(selector);
    const parsedMarker = buildRegexEscapedString(marker);

    await highlight(state, { args: { selector, marker } });
    expect(state.browser.execute).toHaveBeenCalledWith(eraseHighlights);
    expect(state.browser.execute).toHaveBeenCalledWith(findElements, parsedSelector, parsedMarker, returnMultiple, highlightMatches, innerHTMLOnly, undefined);
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: 'Could not locate your element due to an unknown reason', type: MESSAGE_TYPE.ERROR });
  });

  test('highlight action should log error when no selector is provided', async () => {
    const state = {
      browser: {
        execute: jest.fn(),
      },
    };
    await highlight(state, { args: {} });

    expect(logger.emitLogs).toHaveBeenCalledWith({ message: 'Could not locate your element due to an unknown reason', type: MESSAGE_TYPE.ERROR });
  });

  // test('highlight action should log xpaths of all the elements found matching the marker text if multiple markers found and the DEV_MODE env variable is set to 1', async () => {
  //     /*
  //         selector => present
  //         marker => present
  //         elementIndex => not present
  //         result => no element (multiple elements matching marker)
  //     */
  // });

  // test('highlight action should log the xpath(s) of the element(s) which was/were identified by the element finder when the DEV_MODE env variable is set to 1', async () => {
  // });

  // test('highlight action should log when one result is returned in DEV mode', async () => {
  // });
});
