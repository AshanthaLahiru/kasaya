const webdriverio = require('webdriverio');
const launch = require('../../../../src/core/actions/launch');
const logger = require('../../../../src/utils/logger');
const { MESSAGE_TYPE, BROWSER_LAUNCH_ERR } = require('../../../../src/constants');

describe('launch test suite', () => {
  test('launch action should open browser', async () => {
    const state = {
      browser: {},
    };
    webdriverio.remote = jest.fn();

    await launch(state, { args: { browserName: 'chrome' } });
    expect(webdriverio.remote).toHaveBeenCalled();
  });

  test('launch action should log an error if something goes wrong while initializing webdriverio', async () => {
    const state = {
      browser: {},
    };
    webdriverio.remote = () => { throw new Error('Something went wrong'); };
    logger.emitLogs = jest.fn();

    await launch(state, { args: { browserName: 'chrome' } });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: BROWSER_LAUNCH_ERR, type: MESSAGE_TYPE.ERROR });
  });

  test('launch action should open browser with extension', async () => {
    const state = {
      browser: {},
    };
    webdriverio.remote = jest.fn();

    await launch(state, { args: { browserName: 'chrome', extension: 'some_extension' } });
    expect(webdriverio.remote).toHaveBeenCalled();
  });

  test('launch action should open browser in headless mode', async () => {
    const state = {
      browser: {},
    };
    webdriverio.remote = jest.fn();

    await launch(state, { args: { browserName: 'chrome', isHeadless: true } });
    expect(webdriverio.remote).toHaveBeenCalled();
  });
});
