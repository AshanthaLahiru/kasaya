const messageEmitter = require('./messageEmitter');

const validateBrowser = (state) => {
  if (!state || !state.browser) {
    messageEmitter.emitError('No browser session found.!');
    return undefined;
  }
  return state.browser;
};

module.exports = {
  validateBrowser,
};
