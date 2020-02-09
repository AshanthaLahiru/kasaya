const readTitle = require('../../../../src/core/actions/readTitle');
const store = require('../../../../src/core/helpers/dataStore').store();
const logger = require('../../../../src/utils/logger');
const { MESSAGE_TYPE, TITLE_READ_ERR } = require('../../../../src/constants');

describe('readTitle command test suite', () => {
  test('readTitle function should readTitle and fetch variable', async () => {
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn(),
        getTitle: jest.fn().mockResolvedValue('Welcome to Kasaya'),
      },
    };
    store.setGlobal = jest.fn();
    logger.emitLogs = jest.fn();

    await readTitle(state, { args: { searchText: 'Welcome to ${program}' } });
    expect(store.setGlobal).toHaveBeenCalledWith({ key: 'program', value: 'Kasaya' });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: 'Read tokens as: "{"program":"Kasaya"}"', type: MESSAGE_TYPE.INFO });
  });

  test('readTitle function should emit proper error message', async () => {
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn(),
        getTitle: jest.fn().mockResolvedValue('Welcome to Kasaya'),
      },
    };
    logger.emitLogs = jest.fn();

    await readTitle(state, { args: { searchText: 'Bye ${program}' } });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: TITLE_READ_ERR, type: MESSAGE_TYPE.ERROR });
  });
});
