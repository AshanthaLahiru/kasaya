const uuid = require('uuid/v4');
const close = require('../../../../src/core/actions/close');
const logger = require('../../../../src/utils/logger');
const { MESSAGE_TYPE, CLOSE_ERR } = require('../../../../src/constants');

let state;

describe('close command test suite', () => {
  beforeEach(() => {
    state = {
      browser: {
        closeWindow: jest.fn(),
        getWindowHandles: jest.fn(),
        deleteSession: jest.fn(),
        switchToWindow: jest.fn(),
      },
    };
  });

  test('close function should close the browser when "tab" is passed when a single tab is open', async () => {
    state.browser.closeWindow.mockResolvedValue(true);
    state.browser.getWindowHandles.mockResolvedValue(true);

    await close(state, { args: { what: 'tab' } });
    expect(state.browser.closeWindow).toHaveBeenCalled();
    expect(state.browser.getWindowHandles).toHaveBeenCalled();
    expect(state.browser.switchToWindow).toHaveBeenCalled();
  });

  test('close function should close the current tab when "tab" is passed with more than one tabs open', async () => {
    state.browser.closeWindow.mockResolvedValue(true);
    state.browser.getWindowHandles.mockResolvedValue([uuid()]);

    await close(state, { args: { what: 'tab' } });
    expect(state.browser).toBeUndefined();
  });

  test('close function should close the browser when "window" is passed', async () => {
    state.browser.deleteSession.mockReturnValue(Promise.resolve(true));

    await close(state, { args: { what: 'window' } });
    expect(state.browser).toBeUndefined();
  });

  test('close function should emit proper error', async () => {
    logger.emitLogs = jest.fn();

    await close(state, { args: { what: 'wrong value' } });
    expect(state.browser.closeWindow).not.toHaveBeenCalled();
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: CLOSE_ERR, type: MESSAGE_TYPE.ERROR });
  });
});
