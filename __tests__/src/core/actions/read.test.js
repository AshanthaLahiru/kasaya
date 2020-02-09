const { when } = require('jest-when');
const uuid = require('uuid/v4');
const store = require('../../../../src/core/helpers/dataStore').store();
const Terminal = require('../../../../src/utils/terminal');
const { waitForElementPick } = require('../../../../src/utils/browser/elementPicker');
const { findElements } = require('../../../../src/utils/browser/elementFinder');
const { getCrossElements } = require('../../../../src/utils/browser/gridFinder');
const { getInnerText } = require('../../../../src/utils/browser/common');
const read = require('../../../../src/core/actions/read');
const logger = require('../../../../src/utils/logger');
const { MESSAGE_TYPE, MODES } = require('../../../../src/constants');

describe('read commands test suite', () => {
  test('read command should read and parse the text accordingly from the element matching the given xpath, if the xpath is provided', async () => {
    const state = {
      browser: {
        execute: jest.fn(),
        $: jest.fn().mockResolvedValue({ elementId: uuid() }),
        getElementText: jest.fn().mockResolvedValue('Hello users, welcome to Kasaya'),
      },
    };
    logger.emitLogs = jest.fn();
    const sampleXpath = uuid();

    await read.readByTemplate(state, { args: { identifier: Buffer.from(sampleXpath).toString('base64'), searchText: 'Hello ${subjects}, welcome to ${program}' } });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: 'Read tokens as: "{"subjects":"users","program":"Kasaya"}"', type: MESSAGE_TYPE.INFO });
  });

  test('read command should log a specific info message if the provided parameters could not be extracted from the element matching the given xpath, if the xpath is provided', async () => {
    const state = {
      browser: {
        execute: jest.fn(),
        $: jest.fn().mockResolvedValue({ elementId: uuid() }),
        getElementText: jest.fn().mockResolvedValue('Bye users'),
      },
    };
    const sampleXpath = uuid();

    await read.readByTemplate(state, { args: { identifier: Buffer.from(sampleXpath).toString('base64'), searchText: 'Hello ${subjects}' } });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: 'Could not read parameters from the selected element', type: MESSAGE_TYPE.ERROR });
  });

  test('read command should log a specific error message if something goes wrong while reading by xpath', async () => {
    const state = {
      browser: {
        execute: jest.fn(),
        $: () => { throw new Error('Something went wrong'); },
      },
    };
    logger.emitLogs = jest.fn();
    const sampleXpath = uuid();

    await read.readByTemplate(state, { args: { identifier: Buffer.from(sampleXpath).toString('base64'), searchText: 'Hello ${subjects}' } });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: 'Could not locate any element matching the provided identifier.', type: MESSAGE_TYPE.ERROR });
  });

  test('read command should prompt the user to pick the element and show the picked element identifier if no matching element for the selector is not found, and when marker and elementIndex is not present', async () => {
    const sampleXpath = uuid();
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn().mockResolvedValue({
          success: false,
          code: 'BASE_ELEMENT_NOT_FOUND',
        }),
        executeAsync: jest.fn().mockResolvedValue(sampleXpath),
      },
    };
    logger.emitLogs = jest.fn();
    Terminal.setMode(MODES.REPL);
    Terminal.promptQuestion = jest.fn().mockResolvedValue('y');

    await read.readByTemplate(state, { args: { searchText: 'Hello ${subjects}' } });
    expect(Terminal.promptQuestion).toHaveBeenCalledWith('No matching element found. Would you like to point it on the page (y/n): ', { default: 'n' });
    expect(state.browser.executeAsync).toHaveBeenCalledWith(waitForElementPick);
    const encodedXpath = Buffer.from(sampleXpath, 'utf-8').toString('base64');
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: `You selected the following element:  \n\n${encodedXpath}\n`, type: MESSAGE_TYPE.INFO });
  });

  test('read command should prompt the user to pick the element if no matching element for the selector is not found, and return to the kasaya prompt if user responds with "n" to the prompt', async () => {
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn().mockResolvedValue({
          success: false,
          code: 'BASE_ELEMENT_NOT_FOUND',
        }),
        executeAsync: jest.fn(),
      },
    };
    logger.emitLogs = jest.fn();
    Terminal.promptQuestion = jest.fn().mockResolvedValue('n');

    await read.readByTemplate(state, { args: { searchText: 'Hello ${subjects}' } });
    expect(Terminal.promptQuestion).toHaveBeenCalledWith('No matching element found. Would you like to point it on the page (y/n): ', { default: 'n' });
    expect(state.browser.executeAsync).not.toHaveBeenCalled();
    expect(logger.emitLogs).not.toHaveBeenCalled();
  });

  test('read command should prompt the user to pick the element if multiple matching elements found for the marker, when elementIndex is not present', async () => {
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn().mockResolvedValue({
          success: false,
          code: 'MULTIPLE_BASE_ELEMENTS',
        }),
        executeAsync: jest.fn().mockResolvedValue('element_xpath'),
      },
    };
    Terminal.promptQuestion = jest.fn();

    await read.readByTemplate(state, { args: { searchText: 'Hello ${subjects}' } });
    expect(Terminal.promptQuestion).toHaveBeenCalledWith('No unique element found. Would you like to point it on the page (y/n): ', { default: 'n' });
  });

  test('read command should prompt the user to pick the element if an unknown error occurred while searching for the element', async () => {
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn().mockResolvedValue({
          success: false,
          code: 'UNKNOWN_ERROR',
        }),
        executeAsync: jest.fn(),
      },
    };
    Terminal.promptQuestion = jest.fn();

    await read.readByTemplate(state, { args: { searchText: 'Hello ${subjects}' } });
    expect(Terminal.promptQuestion).toHaveBeenCalledWith('Could not locate element. Would you like to point it on the page (y/n): ', { default: 'n' });
  });

  test('read command should parse the innerText of the found element and store the extracted params if exactly one element is found matching the provided criteria', async () => {
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn().mockResolvedValue({
          success: true,
          targetResults: ['some_xpath'],
          score: Math.floor(Math.random() * 100),
        }),
        $: jest.fn().mockResolvedValue({ elementId: uuid() }),
        getElementText: jest.fn().mockResolvedValue('Hello users, welcome to Kasaya'),
      },
    };
    logger.emitLogs = jest.fn();
    store.setGlobal = jest.fn();

    await read.readByTemplate(state, { args: { searchText: 'Hello ${subjects}, welcome to ${program}' } });
    expect(store.setGlobal).toHaveBeenCalledWith({ key: 'subjects', value: 'users' });
    expect(store.setGlobal).toHaveBeenCalledWith({ key: 'program', value: 'Kasaya' });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: 'Read tokens as: "{"subjects":"users","program":"Kasaya"}"', type: MESSAGE_TYPE.INFO });
  });

  test('read command should parse the innerText of the element at the elementIndex and store the extracted params if more than one element is found, but the elementIndex is provided', async () => {
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn().mockResolvedValue({
          success: true,
          targetResults: [uuid(), uuid(), uuid()],
        }),
        $: jest.fn().mockResolvedValue({ elementId: 'some_id' }),
        getElementText: jest.fn().mockResolvedValue('Hello users, welcome to Kasaya'),
      },
    };
    logger.emitLogs = jest.fn();
    store.setGlobal = jest.fn();

    await read.readByTemplate(state, { args: { searchText: 'Hello ${subjects}, welcome to ${program}', index: '1' } });
    expect(store.setGlobal).toHaveBeenCalledWith({ key: 'subjects', value: 'users' });
    expect(store.setGlobal).toHaveBeenCalledWith({ key: 'program', value: 'Kasaya' });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: 'Read tokens as: "{"subjects":"users","program":"Kasaya"}"', type: MESSAGE_TYPE.INFO });
  });

  test('read command should should prompt user to pick the element when no element is returned matching the search criteria', async () => {
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn().mockResolvedValue({
          success: true,
          targetResults: [],
        }),
      },
    };
    Terminal.setMode(MODES.REPL);
    Terminal.promptQuestion = jest.fn();

    await read.readByTemplate(state, { args: { searchText: 'Hello ${subjects}, welcome to ${program}' } });
    // expect(Terminal.promptQuestion).toHaveBeenCalledWith('Could not locate element. Would you like to point it on the page (y/n): ', { default: 'n' });
  });

  test('read command should should log an error if something goes wrong while parsing the element\'s innerText', async () => {
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn().mockResolvedValue({
          success: true,
          targetResults: [uuid()],
        }),
        $: jest.fn().mockResolvedValue({ elementId: uuid() }),
        getElementText: jest.fn().mockImplementation(async () => { throw new Error('Something went wrong'); }),
      },
    };
    Terminal.promptQuestion = jest.fn();

    await read.readByTemplate(state, { args: { searchText: 'Hello ${subjects}, welcome to ${program}' } });
    expect(Terminal.promptQuestion).toHaveBeenCalledWith('Could not locate element. Would you like to point it on the page (y/n): ', { default: 'n' });
  });

  test('read command should ask user to provide the elementIndex if more than one element is found matching the selector and the marker', async () => {
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn().mockResolvedValue({
          success: true,
          targetResults: [uuid(), uuid(), uuid()],
        }),
        $: jest.fn().mockResolvedValue({ elementId: uuid() }),
        getElementText: jest.fn().mockResolvedValue('Hello users, welcome to Kasaya'),
      },
    };
    logger.emitLogs = jest.fn();

    const searchText = 'Hello ${subjects}, welcome to ${program}';
    const marker = uuid();
    await read.readByTemplate(state, { args: { searchText, marker } });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: `We found more than one result matching your search criteria. Please specify what you want to read as follows:\n\tread "${searchText}" <index> near ${marker}\n`, type: MESSAGE_TYPE.QUESTION });
  });

  test('read command should ask user to provide the elementIndex if more than one element is found matching the selector if the marker is not provided', async () => {
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn().mockResolvedValue({
          success: true,
          targetResults: [uuid(), uuid(), uuid()],
        }),
        $: jest.fn().mockResolvedValue({ elementId: uuid() }),
        getElementText: jest.fn().mockResolvedValue('Hello users, welcome to Kasaya'),
      },
    };
    logger.emitLogs = jest.fn();

    const searchText = 'Hello ${subjects}, welcome to ${program}';
    await read.readByTemplate(state, { args: { searchText } });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: `We found more than one result matching your search criteria. Please use "near" keyword to limit the search, or specify what you want to extract as follows:\n\tread "${searchText}" near <marker>\n`, type: MESSAGE_TYPE.QUESTION });
  });

  test('read command should extract and store values by row column selection', async () => {
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn(),
        $: jest.fn().mockResolvedValue({ elementId: uuid() }),
        getElementText: jest.fn().mockResolvedValue('Hello users, welcome to Kasaya'),
      },
    };
    logger.emitLogs = jest.fn();
    store.setGlobal = jest.fn();
    const rowText = 'row_text';
    const columnText = 'column_text';
    const rowXpath = [uuid()];
    const columnXpath = [uuid()];
    const crossElementXpaths = [uuid()];
    when(state.browser.execute).calledWith(findElements, rowText, undefined, true, false, true).mockResolvedValue({ success: true, targetResults: rowXpath });
    when(state.browser.execute).calledWith(findElements, columnText, undefined, true, false, true).mockResolvedValue({ success: true, targetResults: columnXpath });
    when(state.browser.execute).calledWith(getCrossElements, rowXpath[0], columnXpath[0]).mockResolvedValue({ success: true, targetResults: crossElementXpaths });
    when(state.browser.execute).calledWith(getInnerText, crossElementXpaths).mockResolvedValue([{ innerText: 'Hello users, welcome to Kasaya', xpath: uuid() }]);

    await read.readByTemplate(state, { args: { row: rowText, column: columnText, searchText: 'Hello ${subjects}, welcome to ${program}' } });
    expect(store.setGlobal).toHaveBeenCalledWith({ key: 'subjects', value: 'users' });
    expect(store.setGlobal).toHaveBeenCalledWith({ key: 'program', value: 'Kasaya' });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: 'Read tokens as: "{"subjects":"users","program":"Kasaya"}"', type: MESSAGE_TYPE.INFO });
  });

  test('read command should show multiple matches found error message when more than one elements found for row search text', async () => {
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn(),
        $: jest.fn().mockResolvedValue({ elementId: uuid() }),
        getElementText: jest.fn().mockResolvedValue('Hello users, welcome to Kasaya'),
      },
    };
    logger.emitLogs = jest.fn();
    store.setGlobal = jest.fn();
    const searchText = 'Hello ${subjects}, welcome to ${program}';
    const rowText = 'row_text';
    const columnText = 'column_text';
    const rowXpath = [uuid(), uuid()];
    const columnXpath = [uuid()];
    when(state.browser.execute).calledWith(findElements, rowText, undefined, true, false, true).mockResolvedValue({ success: true, targetResults: rowXpath });
    when(state.browser.execute).calledWith(findElements, columnText, undefined, true, false, true).mockResolvedValue({ success: true, targetResults: columnXpath });

    await read.readByTemplate(state, { args: { row: rowText, column: columnText, searchText } });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: `We found more than one result matching your 'row' search criteria. Please specify what you want to read as follows:\n\tread "${searchText}" from row "${rowText}" near <marker> column "${columnText}"\n\tOR\n\tlookup "${columnText}" for "${rowText}" near <marker> as "${searchText}"`, type: MESSAGE_TYPE.QUESTION });
  });

  test('read command should show multiple matches found error message when more than one elements found for column search text', async () => {
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn(),
        $: jest.fn().mockResolvedValue({ elementId: uuid() }),
        getElementText: jest.fn().mockResolvedValue('Hello users, welcome to Kasaya'),
      },
    };
    logger.emitLogs = jest.fn();
    store.setGlobal = jest.fn();
    const searchText = 'Hello ${subjects}, welcome to ${program}';
    const rowText = 'row_text';
    const columnText = 'column_text';
    const rowXpath = [uuid()];
    const columnXpath = [uuid(), uuid()];
    when(state.browser.execute).calledWith(findElements, rowText, undefined, true, false, true).mockResolvedValue({ success: true, targetResults: rowXpath });
    when(state.browser.execute).calledWith(findElements, columnText, undefined, true, false, true).mockResolvedValue({ success: true, targetResults: columnXpath });

    await read.readByTemplate(state, { args: { row: rowText, column: columnText, searchText } });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: `We found more than one result matching your 'column' search criteria. Please specify what you want to read as follows:\n\tread "${searchText}" from row "${rowText}" column "${columnText}" near <marker>\n\tOR\n\tlookup "${columnText}" near <marker> for "${rowText}" as "${searchText}"`, type: MESSAGE_TYPE.QUESTION });
  });

  test('read command should show multiple matches found error message when more than one elements found for cross elements', async () => {
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn(),
        $: jest.fn().mockResolvedValue({ elementId: uuid() }),
        getElementText: jest.fn().mockResolvedValue('Hello users, welcome to Kasaya'),
      },
    };
    logger.emitLogs = jest.fn();
    store.setGlobal = jest.fn();
    const rowText = 'row_text';
    const columnText = 'column_text';
    const inputLine = uuid();
    const rowXpath = [uuid()];
    const columnXpath = [uuid()];
    const crossElementXpaths = [uuid(), uuid()];
    when(state.browser.execute).calledWith(findElements, rowText, undefined, true, false, true).mockResolvedValue({ success: true, targetResults: rowXpath });
    when(state.browser.execute).calledWith(findElements, columnText, undefined, true, false, true).mockResolvedValue({ success: true, targetResults: columnXpath });
    when(state.browser.execute).calledWith(getCrossElements, rowXpath[0], columnXpath[0]).mockResolvedValue({ success: true, targetResults: crossElementXpaths });
    when(state.browser.execute).calledWith(getInnerText, crossElementXpaths).mockResolvedValue([{ innerText: 'Hello users, welcome to Kasaya', xpath: uuid() }, { innerText: 'Hello users, welcome to Kasaya language', xpath: uuid() }]);

    await read.readByTemplate(state, { args: { row: rowText, column: columnText, searchText: 'Hello ${subjects}, welcome to ${program}' }, line: inputLine });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: `We found more than one result matching your search criteria. Please specify what you want to read as follows:\n\t${inputLine} <index>`, type: MESSAGE_TYPE.QUESTION });
  });

  test('read command should log a specific command when it cannot extract the params by row column selection', async () => {
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn(),
        $: jest.fn().mockResolvedValue({ elementId: 'some_id' }),
        getElementText: jest.fn().mockResolvedValue('Hello users, welcome to Kasaya'),
      },
    };
    logger.emitLogs = jest.fn();
    store.setGlobal = jest.fn();
    const rowText = 'row_text';
    const columnText = 'column_text';
    const rowXpath = [uuid()];
    const columnXpath = [uuid()];
    const crossElementXpaths = [uuid(), uuid(), uuid()];
    when(state.browser.execute).calledWith(findElements, rowText, undefined, true, false, true).mockResolvedValue({ success: true, targetResults: rowXpath });
    when(state.browser.execute).calledWith(findElements, columnText, undefined, true, false, true).mockResolvedValue({ success: true, targetResults: columnXpath });
    when(state.browser.execute).calledWith(getCrossElements, rowXpath[0], columnXpath[0]).mockResolvedValue({ success: true, targetResults: crossElementXpaths });
    when(state.browser.execute).calledWith(getInnerText, crossElementXpaths).mockResolvedValue(['Bye users']);

    await read.readByTemplate(state, { args: { row: rowText, column: columnText, searchText: 'Hello ${subjects}' } });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: 'Could not read parameters from the selected element', type: MESSAGE_TYPE.ERROR });
  });
});
