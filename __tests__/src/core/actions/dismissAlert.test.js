const dismissAlert = require('../../../../src/core/actions/dismissAlert');

describe('dismissAlert command test suite', () => {
  test('dismissAlert function should dismiss Alert', async () => {
    const state = {
      browser: {
        dismissAlert: jest.fn(),
      },
    };
    await dismissAlert(state);
    expect(state.browser.dismissAlert).toHaveBeenCalled();
  });
});
