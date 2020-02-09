const uuid = require('uuid/v4');
const wait = require('../../../../src/core/actions/wait');
const { findElements } = require('../../../../src/utils/browser/elementFinder');
const { buildRegexFromParamString, buildRegexEscapedString } = require('../../../../src/utils/buildRegex');
const logger = require('../../../../src/utils/logger');
const { MESSAGE_TYPE, TIME_UNIT_ERR } = require('../../../../src/constants');

describe('wait test suite', () => {
  test('wait action should wait given time when selector and marker is not present', async () => {
    const state = {
      browser: {},
    };
    logger.emitLogs = jest.fn();

    await wait(state, { args: { time: 1 } });
    expect(logger.emitLogs).not.toHaveBeenCalled();
  });

  test('wait action should log an error message if given time is not a valid number', async () => {
    const state = {
      browser: {},
    };
    logger.emitLogs = jest.fn();

    await wait(state, { args: { time: NaN } });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: TIME_UNIT_ERR, type: MESSAGE_TYPE.ERROR });
  });

  test('wait action should wait given time when selector is present and marker is not present', async () => {
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn().mockResolvedValue({ success: true }),
      },
    };
    const selector = uuid();
    const returnMultiple = true;
    const highlightMatch = false;
    const innerHTMLOnly = false;
    const parsedSelector = buildRegexFromParamString(selector);

    await wait(state, { args: { time: 1, selector } });
    expect(state.browser.execute).toHaveBeenCalledWith(findElements, parsedSelector, undefined, returnMultiple, highlightMatch, innerHTMLOnly);
  });

  test('wait action should wait given time when selector and marker are present', async () => {
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn().mockResolvedValue({ success: true }),
      },
    };
    const selector = uuid();
    const marker = uuid();
    const returnMultiple = true;
    const highlightMatch = false;
    const innerHTMLOnly = false;
    const parsedSelector = buildRegexFromParamString(selector);
    const parsedMarker = buildRegexEscapedString(marker);

    await wait(state, { args: { time: 1, selector, marker } });
    expect(state.browser.execute).toHaveBeenCalledWith(findElements, parsedSelector, parsedMarker, returnMultiple, highlightMatch, innerHTMLOnly);
  });

  test('wait action should log an error message with invalid time when selector and marker are present', async () => {
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn().mockResolvedValue({ success: true }),
      },
    };
    const selector = uuid();
    const marker = uuid();
    logger.emitLogs = jest.fn();

    await wait(state, { args: { time: NaN, selector, marker } });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: TIME_UNIT_ERR, type: MESSAGE_TYPE.ERROR });
    expect(state.browser.execute).not.toHaveBeenCalled();
    expect(state.browser.waitUntil).not.toHaveBeenCalled();
  });
});
