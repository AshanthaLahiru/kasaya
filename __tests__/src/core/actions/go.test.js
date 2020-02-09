const go = require('../../../../src/core/actions/go');
const logger = require('../../../../src/utils/logger');
const { MESSAGE_TYPE, NAVIGATION_ERR } = require('../../../../src/constants');

let state;
describe('go command test suite', () => {
  beforeEach(() => {
    state = {
      browser: {
        forward: jest.fn(),
        back: jest.fn(),
      },
    };
  });

  test('go function should forward parameters(forward)', async () => {
    state.browser.forward.mockResolvedValue(true);
    state.browser.back.mockResolvedValue(true);

    await go(state, { args: { direction: 'forward' } });
    expect(state.browser.forward).toHaveBeenCalled();
  });

  test('go function should forward parameters(back)', async () => {
    state.browser.forward.mockResolvedValue(true);
    state.browser.back.mockResolvedValue(true);

    await go(state, { args: { direction: 'back' } });
    expect(state.browser.back).toHaveBeenCalled();
  });

  test('go function should emit proper errors', async () => {
    logger.emitLogs = jest.fn();

    await go(state, { args: { direction: 'wrong value' } });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: NAVIGATION_ERR, type: MESSAGE_TYPE.ERROR });
  });
});
