const execute = require('../../../../src/core/actions/execute');
const logger = require('../../../../src/utils/logger');
const { MESSAGE_TYPE, BROWSER_EXECUTE_FUNC_ERR } = require('../../../../src/constants');
const store = require('../../../../src/core/helpers/dataStore').store();

describe('execute command test suite', () => {
  test('execute command should log the success message if the function executed successfully', async () => {
    const state = {
      browser: {
        execute: jest.fn().mockResolvedValue(true),
      },
    };
    logger.emitLogs = jest.fn();
    const functionIdentifier = 'getVersion';
    const stringArgument = '[firstArgument,secondArgument,$name]';
    store.getGlobal = jest.fn();

    await execute(state, { args: { functionIdentifier, stringArgument } });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: `Function "${functionIdentifier}" executed successfully on the browser.`, type: MESSAGE_TYPE.INFO });
  });

  test('execute command should log an error message if the given function is not available in the browser window object', async () => {
    const state = {
      browser: {
        execute: jest.fn().mockResolvedValue(undefined),
      },
    };
    logger.emitLogs = jest.fn();
    const functionIdentifier = 'getVersion';
    const args = { argument1: 'firstArgument', argument2: 'secondArgument' };

    await execute(state, { args: { functionIdentifier, ...args } });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: `Function "${functionIdentifier}" was not found on the browser!`, type: MESSAGE_TYPE.ERROR });
  });

  test('execute command should log an error message if the function throws an exception', async () => {
    const state = {
      browser: {
        execute: jest.fn().mockResolvedValue(null),
      },
    };
    logger.emitLogs = jest.fn();
    const functionIdentifier = 'getVersion';
    const args = { argument1: 'firstArgument', argument2: 'secondArgument' };

    await execute(state, { args: { functionIdentifier, ...args } });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: BROWSER_EXECUTE_FUNC_ERR, type: MESSAGE_TYPE.ERROR });
  });
});
