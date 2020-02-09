const parseRegex = require('../../utils/parseRegex');
const { validateBrowser } = require('../../utils/validate');

module.exports = async (state, { isNewTab }, { args: { url } }) => {
  const browser = validateBrowser(state);

  if (browser) {
    let navigateUrl = '';
    const { protocol, path } = parseRegex(
      url,
      '((?<protocol>http|https)://)?(?<path>.+)',
      'i',
    );
    if (protocol) {
      navigateUrl = `${protocol}://${path}`;
    } else {
      navigateUrl = `http://${path}`;
    }

    if (isNewTab) {
      await browser.newWindow(navigateUrl);
    } else {
      await browser.url(navigateUrl);
    }
  }
};
