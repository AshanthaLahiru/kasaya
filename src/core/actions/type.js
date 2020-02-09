const { validateBrowser } = require('../../utils/validate');
const logger = require('../../utils/logger');
const { MESSAGE_TYPE, ACTIVE_ELEMENT_ERR } = require('../../constants');

module.exports = async (state, { args: { typeText } }) => {
  const browser = validateBrowser(state);

  if (browser) {
    const activeTextBox = await browser.getActiveElement();
    const tagName = await browser.getElementTagName(activeTextBox.ELEMENT);
    const typableInputs = [
      'date',
      'datetime-local',
      'email',
      'month',
      'number',
      'password',
      'search',
      'tel',
      'text',
      'time',
      'url',
      'week',
    ];
    const inputType = await browser.getElementAttribute(activeTextBox.ELEMENT, 'type');
    const isTypableInput = (tagName === 'input' && (typableInputs.includes(inputType)));

    if (!(tagName === 'textarea' || isTypableInput)) {
      return logger.emitLogs({ message: ACTIVE_ELEMENT_ERR, type: MESSAGE_TYPE.ERROR });
    }
    await browser.elementSendKeys(activeTextBox.ELEMENT, [typeText]);
  }
};
