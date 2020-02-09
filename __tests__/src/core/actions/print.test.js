const uuid = require('uuid/v4');
const store = require('../../../../src/core/helpers/dataStore').store();
const print = require('../../../../src/core/actions/print');
const logger = require('../../../../src/utils/logger');
const { MESSAGE_TYPE, NO_VARIABLE_FOUND } = require('../../../../src/constants');

describe('print action test suite', () => {
  test('print command should emit the value of the key', async () => {
    const storedKey = `$${uuid()}`;
    const storedValue = uuid();
    logger.emitLogs = jest.fn();
    store.getGlobal = jest.fn().mockReturnValue(storedValue);

    await print({ args: { variable: storedKey } });
    expect(store.getGlobal).toHaveBeenCalledWith(storedKey);
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: storedValue, type: MESSAGE_TYPE.INFO });
  });

  test('print command should emit proper error, when value is not found', async () => {
    const storedKey = `$${uuid()}`;
    logger.emitLogs = jest.fn();
    store.getGlobal = jest.fn().mockReturnValue(undefined);

    await print({ args: { variable: storedKey } });
    expect(store.getGlobal).toHaveBeenCalledWith(storedKey);
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: NO_VARIABLE_FOUND, type: MESSAGE_TYPE.INFO });
  });
});
