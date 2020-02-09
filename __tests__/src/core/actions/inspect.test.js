const uuid = require('uuid/v4');
const inspect = require('../../../../src/core/actions/inspect');
const logger = require('../../../../src/utils/logger');
const { MESSAGE_TYPE, INSPECT_ERR } = require('../../../../src/constants');

describe('Inspect command test suite', () => {
  test('inspect function should launch inpector', async () => {
    const htmlString = '<img></img>';
    const element = {
      getHTML: jest.fn().mockResolvedValue(htmlString),
    };
    const state = {
      browser: {
        executeAsync: jest.fn().mockResolvedValue(uuid()),
        execute: jest.fn(),
        $: jest.fn().mockResolvedValue(element),
      },
    };
    logger.emitLogs = jest.fn();

    await inspect(state);
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: 'Click the element whose DOM structure you want to view', type: MESSAGE_TYPE.QUESTION });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: '\n<img>\n</img>\n', type: MESSAGE_TYPE.PLAIN });
  });

  test('inspect function should log raw html content if an error occurs while attempting to format with indentation', async () => {
    const htmlString = '<img></img>';
    const element = {
      getHTML: jest.fn().mockResolvedValue(htmlString),
    };
    const state = {
      browser: {
        executeAsync: jest.fn().mockResolvedValue(uuid()),
        execute: jest.fn(),
        $: jest.fn().mockResolvedValue(element),
      },
    };
    logger.emitLogs = jest.fn();

    await inspect(state);
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: 'Click the element whose DOM structure you want to view', type: MESSAGE_TYPE.QUESTION });
  });

  test('inspect function should emit proper error', async () => {
    const htmlString = '<img></img>';
    const element = {
      getHTML: jest.fn().mockResolvedValue(htmlString),
    };
    const state = {
      browser: {
        executeAsync: jest.fn().mockResolvedValue(undefined),
        execute: jest.fn(),
        $: jest.fn().mockResolvedValue(element),
      },
    };
    logger.emitLogs = jest.fn();

    await inspect(state);
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: INSPECT_ERR, type: MESSAGE_TYPE.ERROR });
  });
});
