const uuid = require('uuid/v4');
const clear = require('../../../../src/core/actions/clear');
const eraser = require('../../../../src/utils/browser/eraser');
const logger = require('../../../../src/utils/logger');
const { MESSAGE_TYPE, CLEAR_ERR } = require('../../../../src/constants');

let state;
describe('clear action test suite', () => {
  beforeEach(() => {
    state = {
      browser: {
        getActiveElement: jest.fn(),
        elementClear: jest.fn(),
        execute: jest.fn(),
      },
    };
  });

  test('clear command with target type "input" should trigger the corresponding webdriver.io function to clear the currently active input element', async () => {
    const currentlyActiveElementId = uuid();
    state.browser.getActiveElement.mockResolvedValue({
      ELEMENT: currentlyActiveElementId,
    });
    state.browser.elementClear.mockResolvedValue(true);

    await clear(state, { args: { what: 'input' } });
    expect(state.browser.getActiveElement).toHaveBeenCalled();
    expect(state.browser.elementClear).toHaveBeenCalled();
    expect(state.browser.elementClear).toHaveBeenCalledWith(currentlyActiveElementId);
    expect(state.browser.execute).not.toHaveBeenCalled();
  });

  test('clear command with target type "text" should trigger the corresponding webdriver.io function to clear the currently active input element', async () => {
    const currentlyActiveElementId = uuid();
    state.browser.getActiveElement.mockResolvedValue({
      ELEMENT: currentlyActiveElementId,
    });

    await clear(state, { args: { what: 'text' } });
    expect(state.browser.getActiveElement).toHaveBeenCalled();
    expect(state.browser.elementClear).toHaveBeenCalled();
    expect(state.browser.elementClear).toHaveBeenCalledWith(currentlyActiveElementId);
    expect(state.browser.execute).not.toHaveBeenCalled();
  });

  test('clear command with target type "highlights" should execute the highlight erasor on the page to clear highlights from the page', async () => {
    await clear(state, { args: { what: 'highlights' } });
    expect(state.browser.getActiveElement).not.toHaveBeenCalled();
    expect(state.browser.elementClear).not.toHaveBeenCalled();
    expect(state.browser.execute).toHaveBeenCalled();
    expect(state.browser.execute).toHaveBeenCalledWith(eraser.eraseHighlights);
  });

  test('clear command with an unknown should return a rejected promise with a specific error message', async () => {
    logger.emitLogs = jest.fn();

    try {
      await clear(state, { args: { what: uuid() } });
    } catch (err) {
      expect(err).toBeTruthy();
      expect(err).toHaveProperty('message', 'Incorrect usage of command. Accepted parameters are, "text", "input" or "highlights"');
      expect(state.browser.getActiveElement).not.toHaveBeenCalled();
      expect(state.browser.elementClear).not.toHaveBeenCalled();
      expect(state.browser.execute).toHaveBeenCalled();
      expect(logger.emitLogs).toHaveBeenCalledWith({ message: CLEAR_ERR, type: MESSAGE_TYPE.ERROR });
    }
  });
});
