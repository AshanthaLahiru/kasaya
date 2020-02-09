const uuid = require('uuid/v4');
const type = require('../../../../src/core/actions/type');
const logger = require('../../../../src/utils/logger');
const { MESSAGE_TYPE, ACTIVE_ELEMENT_ERR } = require('../../../../src/constants');

describe('type command test suite', () => {
  test('type function should trigger the corresponding webdriver function with the provided parameters when the target element is an "input"', async () => {
    const state = {
      browser: {
        getActiveElement: jest.fn(),
        getElementTagName: jest.fn(),
        getElementAttribute: jest.fn(),
        elementSendKeys: jest.fn(),
      },
    };
    const allowedInputTypes = ['date',
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
      'week'];

    for (let i = 0; i < allowedInputTypes.length; i += 1) {
      const elementUUID = uuid();
      state.browser.getActiveElement.mockResolvedValue({ ELEMENT: elementUUID });
      state.browser.getElementTagName.mockResolvedValue('input');
      state.browser.getElementAttribute.mockResolvedValue(allowedInputTypes[i]);

      // eslint-disable-next-line no-await-in-loop
      await type(state, { args: { typeText: '1234' } });
      expect(state.browser.elementSendKeys).toHaveBeenCalledWith(elementUUID, ['1234']);
    }
  });

  test('type function should trigger the corresponding webdriver function with the provided parameters when the target element is a text area', async () => {
    const state = {
      browser: {
        getActiveElement: jest.fn(),
        getElementTagName: jest.fn(),
        getElementAttribute: jest.fn(),
        elementSendKeys: jest.fn(),
      },
    };

    const elementUUID = uuid();
    state.browser.getActiveElement.mockResolvedValue({ ELEMENT: elementUUID });
    state.browser.getElementTagName.mockResolvedValue('textarea');
    state.browser.getElementAttribute.mockResolvedValue('');

    await type(state, { args: { typeText: '1234' } });
    expect(state.browser.elementSendKeys).toHaveBeenCalledWith(elementUUID, ['1234']);
  });

  test('type function should reject with an error if the currently focused element is not a text area or a typable input type', async () => {
    const state = {
      browser: {
        getActiveElement: jest.fn(),
        getElementTagName: jest.fn(),
        getElementAttribute: jest.fn(),
        elementSendKeys: jest.fn(),
      },
    };
    logger.emitLogs = jest.fn();

    const elementUUID = uuid();
    state.browser.getActiveElement.mockResolvedValue({ ELEMENT: elementUUID });
    state.browser.getElementTagName.mockResolvedValue('');
    state.browser.getElementAttribute.mockResolvedValue('');

    await type(state, { args: { typeText: '1234' } });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: ACTIVE_ELEMENT_ERR, type: MESSAGE_TYPE.ERROR });
  });
});
