const readUrl = require('../../../../src/core/actions/readUrl');
const store = require('../../../../src/core/helpers/dataStore').store();
const logger = require('../../../../src/utils/logger');
const { MESSAGE_TYPE, URL_READ_ERR } = require('../../../../src/constants');

describe('readUrl command test suite', () => {
  test('readUrl function should readUrl and fetch variable', async () => {
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn(),
        getUrl: jest.fn().mockResolvedValue('http://kasaya.org'),
      },
    };
    store.setGlobal = jest.fn();
    logger.emitLogs = jest.fn();

    await readUrl(state, { args: { searchText: 'http://${domain}.org' } });
    expect(store.setGlobal).toHaveBeenCalledWith({ key: 'domain', value: 'kasaya' });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: 'Read tokens as: "{"domain":"kasaya"}"', type: MESSAGE_TYPE.INFO });
  });

  test('readUrl function should emit proper error message', async () => {
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn(),
        getUrl: jest.fn().mockResolvedValue('http://kasaya.org'),
      },
    };
    logger.emitLogs = jest.fn();

    await readUrl(state, { args: { searchText: 'https://${domain}.org' } });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: URL_READ_ERR, type: MESSAGE_TYPE.ERROR });
  });
});
