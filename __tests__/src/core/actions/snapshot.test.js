const snapshot = require('../../../../src/core/actions/snapshot');
const store = require('../../../../src/core/helpers/dataStore').store();
const logger = require('../../../../src/utils/logger');
const { MESSAGE_TYPE } = require('../../../../src/constants');

describe('browser snapshot test suite', () => {
  test('get snapshot should log the captured snapshot details', async () => {
    const mockSnapshot = { browser: 'browser_name' };
    const state = {
      browser: {
        execute: jest.fn().mockResolvedValue(mockSnapshot),
      },
    };
    store.setGlobal = jest.fn();
    logger.emitLogs = jest.fn();
    const snapshotReference = '$snapshot_name';

    await snapshot(state, { mode: 'get' }, { args: { snapshotReference } });
    expect(store.setGlobal).toHaveBeenCalledWith({ key: snapshotReference, value: mockSnapshot });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: `Browser snapshot created as "${snapshotReference.replace('$', '')}"`, type: MESSAGE_TYPE.INFO });
  });

  test('set snapshot should call the execute function and refresh', async () => {
    const state = {
      browser: {
        execute: jest.fn(),
        refresh: jest.fn(),
      },
    };
    store.getGlobal = jest.fn();
    const snapshotReference = '$snapshot_name';

    await snapshot(state, { mode: 'set' }, { args: { snapshotReference } });
    expect(state.browser.execute).toHaveBeenCalled();
    expect(state.browser.refresh).toHaveBeenCalled();
  });
});
