const { validateBrowser } = require('../../../src/utils/validate');
const messageEmitter = require('../../../src/utils/messageEmitter');

describe('validate test suite', () => {
  test('browser should validate the state and return the browser', () => {
    const state = {
      browser: {},
    };

    const validatedBrowser = validateBrowser(state);
    expect(validatedBrowser).toBe(state.browser);
  });

  test('browser should log an error message with invalid state', () => {
    const state = undefined;
    messageEmitter.emitError = jest.fn();

    validateBrowser(state);
    expect(messageEmitter.emitError).toHaveBeenCalledWith('No browser session found.!');
  });

  test('browser should log an error message with invalid browser', () => {
    const state = {
      browser: undefined,
    };
    messageEmitter.emitError = jest.fn();

    validateBrowser(state);
    expect(messageEmitter.emitError).toHaveBeenCalledWith('No browser session found.!');
  });
});
