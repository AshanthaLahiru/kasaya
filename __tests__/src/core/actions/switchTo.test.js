const uuid = require('uuid/v4');
const switchTo = require('../../../../src/core/actions/switchTo');
const logger = require('../../../../src/utils/logger');
const { MESSAGE_TYPE, SWITCH_ERR } = require('../../../../src/constants');

describe('switch command test suite', () => {
  test('switchTo function should return if only single tab is open when "tab" is passed', async () => {
    const state = {
      browser: {
        getWindowHandle: jest.fn(),
        getWindowHandles: jest.fn(),
      },
    };
    state.browser.getWindowHandles.mockResolvedValue([uuid()]);
    state.browser.getWindowHandle.mockResolvedValue(uuid());

    await switchTo(state, { args: { what: 'tab' } });
    expect(state.browser.getWindowHandle).toHaveBeenCalled();
    expect(state.browser.getWindowHandles).toHaveBeenCalled();
  });

  test('switchTo function should switch between tabs when "tab" is passed when multiple tabs are open and current tab is the initial tab', async () => {
    const state = {
      browser: {
        getWindowHandles: jest.fn(),
        getWindowHandle: jest.fn(),
        switchToWindow: jest.fn(),
      },
    };
    const handles = [uuid(), uuid()];
    const currentWindow = handles[0];
    state.browser.getWindowHandles.mockResolvedValue(handles);
    state.browser.getWindowHandle.mockResolvedValue(currentWindow);
    state.browser.switchToWindow.mockResolvedValue(true);

    await switchTo(state, { args: { what: 'tab' } });
    expect(state.browser.getWindowHandle).toHaveBeenCalled();
    expect(state.browser.getWindowHandles).toHaveBeenCalled();
    expect(state.browser.switchToWindow).toHaveBeenCalled();
  });

  test('switchTo function should switch between tabs when "tab" is passed when multiple tabs are open and current tab is the latest tab', async () => {
    const state = {
      browser: {
        getWindowHandles: jest.fn(),
        getWindowHandle: jest.fn(),
        switchToWindow: jest.fn(),
      },
    };
    const handles = [uuid(), uuid()];
    const currentWindow = handles[1];
    state.browser.getWindowHandles.mockResolvedValue(handles);
    state.browser.getWindowHandle.mockResolvedValue(currentWindow);
    state.browser.switchToWindow.mockResolvedValue(true);

    await switchTo(state, { args: { what: 'tab' } });
    expect(state.browser.getWindowHandle).toHaveBeenCalled();
    expect(state.browser.getWindowHandles).toHaveBeenCalled();
    expect(state.browser.switchToWindow).toHaveBeenCalled();
  });

  test('switchTo function should return if only single tab is open when "window" is passed', async () => {
    const state = {
      browser: {
        getWindowHandle: jest.fn(),
        getWindowHandles: jest.fn(),
      },
    };
    state.browser.getWindowHandles.mockResolvedValue([uuid()]);
    state.browser.getWindowHandle.mockResolvedValue(uuid());

    await switchTo(state, { args: { what: 'window' } });
    expect(state.browser.getWindowHandle).toHaveBeenCalled();
    expect(state.browser.getWindowHandles).toHaveBeenCalled();
  });

  test('switchTo function should switch between tabs when "window" is passed when multiple tabs are open and current tab is the initial tab', async () => {
    const state = {
      browser: {
        getWindowHandles: jest.fn(),
        getWindowHandle: jest.fn(),
        switchToWindow: jest.fn(),
      },
    };
    const handles = [uuid(), uuid()];
    const currentWindow = handles[0];
    state.browser.getWindowHandles.mockResolvedValue(handles);
    state.browser.getWindowHandle.mockResolvedValue(currentWindow);
    state.browser.switchToWindow.mockResolvedValue(true);

    await switchTo(state, { args: { what: 'window' } });
    expect(state.browser.getWindowHandle).toHaveBeenCalled();
    expect(state.browser.getWindowHandles).toHaveBeenCalled();
    expect(state.browser.switchToWindow).toHaveBeenCalled();
  });

  test('switchTo function should switch between tabs when "window" is passed when multiple tabs are open and current tab is the latest tab', async () => {
    const state = {
      browser: {
        getWindowHandles: jest.fn(),
        getWindowHandle: jest.fn(),
        switchToWindow: jest.fn(),
      },
    };
    const handles = [uuid(), uuid()];
    const currentWindow = handles[1];
    state.browser.getWindowHandles.mockResolvedValue(handles);
    state.browser.getWindowHandle.mockResolvedValue(currentWindow);
    state.browser.switchToWindow.mockResolvedValue(true);

    await switchTo(state, { args: { what: 'tab' } });
    expect(state.browser.getWindowHandle).toHaveBeenCalled();
    expect(state.browser.getWindowHandles).toHaveBeenCalled();
    expect(state.browser.switchToWindow).toHaveBeenCalled();
  });

  test('switchTo function should emit an error message if an incorrect parameter is passed', async () => {
    const state = {
      browser: {
        getWindowHandles: jest.fn(),
        getWindowHandle: jest.fn(),
        switchToWindow: jest.fn(),
      },
    };
    logger.emitLogs = jest.fn();

    await switchTo(state, { args: { what: 'incorrect' } });
    expect(state.browser.getWindowHandle).not.toHaveBeenCalled();
    expect(state.browser.getWindowHandles).not.toHaveBeenCalled();
    expect(state.browser.switchToWindow).not.toHaveBeenCalled();
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: SWITCH_ERR, type: MESSAGE_TYPE.ERROR });
  });
});
