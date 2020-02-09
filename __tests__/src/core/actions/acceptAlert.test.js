const acceptAlert = require('../../../../src/core/actions/acceptAlert');

describe('acceptAlert command test suite', () => {
  test('acceptAlert function should accept Alert', async () => {
    const state = {
      browser: { acceptAlert: jest.fn() },
    };

    await acceptAlert(state);
    expect(state.browser.acceptAlert.mock.calls.length).toBe(1);
  });
});
