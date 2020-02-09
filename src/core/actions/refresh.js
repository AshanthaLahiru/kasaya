const { validateBrowser } = require('../../utils/validate');

module.exports = async (state) => {
  const browser = validateBrowser(state);

  if (browser) {
    await browser.refresh();
  }
};
