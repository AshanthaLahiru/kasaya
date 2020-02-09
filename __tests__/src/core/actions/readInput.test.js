const { when } = require('jest-when');
const uuid = require('uuid/v4');
const store = require('../../../../src/core/helpers/dataStore').store();
const { findElements } = require('../../../../src/utils/browser/elementFinder');
const { getPlaceholder } = require('../../../../src/utils/browser/common');
const { nearestElementFinder } = require('../../../../src/utils/browser/nearestElementFinder');
const { activeRead, selectiveRead } = require('../../../../src/core/actions/readInput');
const logger = require('../../../../src/utils/logger');
const { MESSAGE_TYPE } = require('../../../../src/constants');

describe('read input commands test suite', () => {
  test('read input command should log the status of the checkbox when isSelector is true', async () => {
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn(),
        $: jest.fn().mockResolvedValue({
          elementId: 'some_id',
          getTagName: jest.fn().mockResolvedValue('input'),
          isSelected: jest.fn().mockResolvedValue('true'),
        }),
      },
    };
    logger.emitLogs = jest.fn();
    store.setGlobal = jest.fn();
    const selectorText = 'selector';
    const xpathArray = [uuid()];
    const destinationVar = 'subject';
    when(state.browser.execute).calledWith(findElements, selectorText, undefined, true, false, false, undefined, undefined, true).mockResolvedValue({ success: true, targetResults: xpathArray });

    await selectiveRead(state, { isSelector: true }, { args: { selector: selectorText, destinationVar } });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: 'Read tokens as: "{"subject":"true"}"', type: MESSAGE_TYPE.INFO });
  });

  test('read input command should log the value of the input field when isTextField is true', async () => {
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn(),
        $: jest.fn().mockResolvedValue({
          elementId: 'some_id',
          getTagName: jest.fn().mockResolvedValue('input'),
          getValue: jest.fn().mockResolvedValue('input_value'),
        }),
      },
    };
    logger.emitLogs = jest.fn();
    store.setGlobal = jest.fn();
    const selectorText = 'selector';
    const xpathArray = [uuid()];
    const destinationVar = 'subject';
    when(state.browser.execute).calledWith(findElements, selectorText, undefined, true, false, false, undefined, undefined, true).mockResolvedValue({ success: true, targetResults: xpathArray });

    await selectiveRead(state, { isTextField: true }, { args: { selector: selectorText, destinationVar } });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: 'Read tokens as: "{"subject":"input_value"}"', type: MESSAGE_TYPE.INFO });
  });

  test('read input command should log the placeholder value when isPlaceholder is true', async () => {
    const element = {
      elementId: 'some_id',
      getTagName: jest.fn().mockResolvedValue('input'),
      getValue: jest.fn().mockResolvedValue('input_value'),
    };
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn(),
        $: jest.fn().mockResolvedValue(element),
      },
    };
    logger.emitLogs = jest.fn();
    store.setGlobal = jest.fn();
    const selectorText = 'selector';
    const xpathArray = [uuid()];
    const destinationVar = 'subject';
    when(state.browser.execute).calledWith(findElements, selectorText, undefined, true, false, false, undefined, undefined, true).mockResolvedValue({ success: true, targetResults: xpathArray });
    when(state.browser.execute).calledWith(getPlaceholder, element).mockResolvedValue('input_value');

    await selectiveRead(state, { isPlaceholder: true }, { args: { selector: selectorText, destinationVar } });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: 'Read tokens as: "{"subject":"input_value"}"', type: MESSAGE_TYPE.INFO });
  });

  test('read input command should log the closest input field value to the given element when the elementFinder gives a non input element', async () => {
    const element = {
      elementId: 'some_id',
      getTagName: jest.fn().mockResolvedValue('div'),
      getValue: jest.fn().mockResolvedValue('input_value'),
    };
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn(),
        $: jest.fn().mockResolvedValue(element),
        getElementText: jest.fn().mockResolvedValue('Hello users, welcome to Kasaya'),
      },
    };
    logger.emitLogs = jest.fn();
    store.setGlobal = jest.fn();
    const selectorText = 'selector';
    const xpathArray = [uuid()];
    const destinationVar = 'subject';
    when(state.browser.execute).calledWith(findElements, selectorText, undefined, true, false, false, undefined, undefined, true).mockResolvedValue({ success: true, targetResults: xpathArray });
    when(state.browser.execute).calledWith(nearestElementFinder, element, 'INPUT').mockResolvedValue('some_xpath');

    await selectiveRead(state, { isTextField: true }, { args: { selector: selectorText, destinationVar } });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: 'Read tokens as: "{"subject":"input_value"}"', type: MESSAGE_TYPE.INFO });
  });

  test('read input command should ask user to provide the elementIndex if more than one element is found matching the selector and the marker', async () => {
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn().mockResolvedValue({
          success: true,
          targetResults: [uuid(), uuid(), uuid()],
        }),
        $: jest.fn().mockResolvedValue({ elementId: uuid() }),
      },
    };
    logger.emitLogs = jest.fn();
    const selectorText = 'selector';
    const destinationVar = 'subject';

    await selectiveRead(state, { isTextField: true }, { args: { selector: selectorText, destinationVar } });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: `We found more than one result matching your search criteria. Please specify what you want to read as follows:\n\tread value from "${selectorText}" field <index> as ${destinationVar}`, type: MESSAGE_TYPE.QUESTION });
  });

  test('read input command should log the value of the input field when the elementIndex is given to select one from the multiple matches', async () => {
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn().mockResolvedValue({
          success: true,
          targetResults: [uuid(), uuid(), uuid()],
        }),
        $: jest.fn().mockResolvedValue({
          elementId: 'some_id',
          getTagName: jest.fn().mockResolvedValue('input'),
          getValue: jest.fn().mockResolvedValue('input_value'),
        }),
      },
    };
    logger.emitLogs = jest.fn();
    const selectorText = 'selector';
    const destinationVar = 'subject';
    const elementIndex = 1;

    await selectiveRead(state, { isTextField: true }, { args: { selector: selectorText, destinationVar, elementIndex } });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: 'Read tokens as: "{"subject":"input_value"}"', type: MESSAGE_TYPE.INFO });
  });


  test('read input command should log an error message when the search text is not found', async () => {
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn(),
        $: jest.fn(),
      },
    };
    logger.emitLogs = jest.fn();
    store.setGlobal = jest.fn();
    const selectorText = 'selector';
    const destinationVar = 'subject';
    when(state.browser.execute).calledWith(findElements, selectorText, undefined, true, false, false, undefined, undefined, true).mockResolvedValue({ success: false, code: 'TARGET_NOT_FOUND' });

    await selectiveRead(state, { isTextField: true }, { args: { selector: selectorText, destinationVar } });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: `Could not locate an element matching text "${selectorText}"`, type: MESSAGE_TYPE.ERROR });
  });

  test('read input command should log an error message when the marker text is not found', async () => {
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn(),
        $: jest.fn(),
      },
    };
    logger.emitLogs = jest.fn();
    store.setGlobal = jest.fn();
    const selectorText = 'selector';
    const markerText = 'marker';
    const destinationVar = 'subject';
    when(state.browser.execute).calledWith(findElements, selectorText, markerText, true, false, false, undefined, undefined, true).mockResolvedValue({ success: false, code: 'BASE_ELEMENT_NOT_FOUND' });

    await selectiveRead(state, { isTextField: true }, { args: { selector: selectorText, marker: markerText, destinationVar } });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: `Could not locate an element matching text "${markerText}"`, type: MESSAGE_TYPE.ERROR });
  });

  test('read input command should log an error message when multiple markers are found', async () => {
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn(),
        $: jest.fn(),
      },
    };
    logger.emitLogs = jest.fn();
    store.setGlobal = jest.fn();
    const selectorText = 'selector';
    const markerText = 'marker';
    const destinationVar = 'subject';
    when(state.browser.execute).calledWith(findElements, selectorText, markerText, true, false, false, undefined, undefined, true).mockResolvedValue({ success: false, code: 'MULTIPLE_BASE_ELEMENTS' });

    await selectiveRead(state, { isTextField: true }, { args: { selector: selectorText, marker: markerText, destinationVar } });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: `Found more than one elements matching text "${markerText}". Try using a unique text after 'near' keyword.`, type: MESSAGE_TYPE.ERROR });
  });

  test('read input command should log an error message when element finder gives an unknown error', async () => {
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn(),
        $: jest.fn(),
      },
    };
    logger.emitLogs = jest.fn();
    store.setGlobal = jest.fn();
    const selectorText = 'selector';
    const markerText = 'marker';
    const destinationVar = 'subject';
    when(state.browser.execute).calledWith(findElements, selectorText, markerText, true, false, false, undefined, undefined, true).mockResolvedValue({ success: false, code: 'UNKNOWN_ERROR' });

    await selectiveRead(state, { isTextField: true }, { args: { selector: selectorText, marker: markerText, destinationVar } });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: 'Could not locate your element due to an unknown reason', type: MESSAGE_TYPE.ERROR });
  });
});

describe('read active field commands test suite', () => {
  test('read active field should log the active field value', async () => {
    const state = {
      browser: {
        execute: jest.fn().mockResolvedValue('resolved_value'),
      },
    };
    logger.emitLogs = jest.fn();
    store.setGlobal = jest.fn();
    const destinationVar = 'subject';

    await activeRead(state, { args: { destinationVar } });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: 'Read tokens as: "{"subject":"resolved_value"}"', type: MESSAGE_TYPE.INFO });
  });
});
