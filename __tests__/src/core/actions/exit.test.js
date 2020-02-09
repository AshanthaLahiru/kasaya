const exit = require('../../../../src/core/actions/exit');
const logger = require('../../../../src/utils/logger');
const { MESSAGE_TYPE, BROWSER_DETACHED_ERR } = require('../../../../src/constants');

describe('exit action test suite', () => {
  test('exit command should close the browser and exit the prompt', async () => {
    const state = {
      browser: {
        deleteSession: jest.fn(),
      },
    };

    logger.emitLogs = jest.fn();
    process.exit = jest.fn();
    state.browser.deleteSession.mockResolvedValue(true);

    await exit(state);
    expect(state.browser.deleteSession).toHaveBeenCalled();
  });

  test('exit command should log an error if an error occurs while deleting the session ', async () => {
    const state = {
      browser: {
        deleteSession: jest.fn(() => {
          throw new Error();
        }),
      },
    };

    logger.emitLogs = jest.fn();
    process.exit = jest.fn();

    await exit(state);
    expect(state.browser.deleteSession).toHaveBeenCalled();
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: BROWSER_DETACHED_ERR, type: MESSAGE_TYPE.ERROR });
  });
});
