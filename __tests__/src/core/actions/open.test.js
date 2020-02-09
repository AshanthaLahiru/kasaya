const uuid = require('uuid/v4');
const open = require('../../../../src/core/actions/open');

describe('open action test suite', () => {
  test('open action should trigger the corresponding webdriver.io function to open the provided url with protocol', async () => {
    const state = {
      browser: {
        url: jest.fn(),
      },
    };
    const path = uuid();
    const url = `https://${path}`;

    await open(state, { isNewTab: false }, { args: { url } });
    expect(state.browser.url).toHaveBeenCalledWith(url);
  });

  test('open action should trigger the corresponding webdriver.io function to open the provided url without protocol', async () => {
    const state = {
      browser: {
        url: jest.fn(),
      },
    };
    const url = uuid();

    await open(state, { isNewTab: false }, { args: { url } });
    expect(state.browser.url).toHaveBeenCalledWith(`http://${url}`);
  });

  test('open action should trigger the corresponding webdriver.io function to open the provided url with protocol in a new tab', async () => {
    const state = {
      browser: {
        newWindow: jest.fn(),
      },
    };
    const path = uuid();
    const url = `https://${path}`;

    await open(state, { isNewTab: true }, { args: { url } });
    expect(state.browser.newWindow).toHaveBeenCalledWith(url);
  });

  test('open action should trigger the corresponding webdriver.io function to open the provided url without protocol in a new tab', async () => {
    const state = {
      browser: {
        newWindow: jest.fn(),
      },
    };
    const url = uuid();

    await open(state, { isNewTab: true }, { args: { url } });
    expect(state.browser.newWindow).toHaveBeenCalledWith(`http://${url}`);
  });
});
