const readAlert = require('../../../../src/core/actions/readAlert');
const store = require('../../../../src/core/helpers/dataStore').store();
const logger = require('../../../../src/utils/logger');
const { MESSAGE_TYPE, ALERT_READ_ERR } = require('../../../../src/constants');

describe('readAlert command test suite', () => {
  test('readAlert function should readAlert and fetch variable', async () => {
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn(),
        getAlertText: jest.fn().mockResolvedValue('Welcome to Kasaya'),
      },
    };
    store.setGlobal = jest.fn();
    logger.emitLogs = jest.fn();

    await readAlert(state, { args: { searchText: 'Welcome to ${program}' } });
    expect(store.setGlobal).toHaveBeenCalledWith({ key: 'program', value: 'Kasaya' });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: 'Read tokens as: "{"program":"Kasaya"}"', type: MESSAGE_TYPE.INFO });
  });

  test('readAlert function should emit proper error message', async () => {
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn(),
        getAlertText: jest.fn().mockResolvedValue('Welcome to Kasaya'),
      },
    };
    logger.emitLogs = jest.fn();

    await readAlert(state, { args: { searchText: 'Something else ${program}' } });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: ALERT_READ_ERR, type: MESSAGE_TYPE.ERROR });
  });
});
