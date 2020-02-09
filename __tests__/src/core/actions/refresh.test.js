const refresh = require('../../../../src/core/actions/refresh');

describe('refresh command test suite', () => {
  test('refresh function should refresh the page', async () => {
    const state = {
      browser: {
        refresh: jest.fn(),
      },
    };
    state.browser.refresh.mockResolvedValue(true);

    await refresh(state);
    expect(state.browser.refresh).toHaveBeenCalled();
  });
});
