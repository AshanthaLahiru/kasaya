const uuid = require('uuid/v4');
const { when } = require('jest-when');
const set = require('../../../../src/core/actions/set');
const store = require('../../../../src/core/helpers/dataStore').store();
const logger = require('../../../../src/utils/logger');
const { MESSAGE_TYPE, VARIABLE_FORMAT_ERR } = require('../../../../src/constants');

describe('set command test suite', () => {
  test('copy function should set the value to new key', async () => {
    const storeKey = `$${uuid()}`;
    const valueInStore = uuid();
    const newKey = `$${uuid()}`;

    store.getGlobal = jest.fn();
    store.setGlobal = jest.fn();
    logger.emitLogs = jest.fn();

    when(store.getGlobal).calledWith(storeKey).mockReturnValue(valueInStore);
    when(store.setGlobal).calledWith({ key: newKey, value: valueInStore }).mockReturnValue(true);

    await set.copyValue({ args: { sourceVar: storeKey, destinationVar: newKey } });
    expect(store.getGlobal).toHaveBeenCalledWith(storeKey);
    expect(store.setGlobal).toHaveBeenCalledWith({ key: newKey, value: valueInStore });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: `Initialized variable as: "${newKey}: ${valueInStore}"`, type: MESSAGE_TYPE.INFO });
  });

  test('copy function should not set the value without "$" prefixed in key', async () => {
    const storeKey = `${uuid()}`;
    const valueInStore = uuid();
    const newKey = `${uuid()}`;

    store.getGlobal = jest.fn();
    store.setGlobal = jest.fn();
    logger.emitLogs = jest.fn();

    when(store.getGlobal).calledWith(storeKey).mockReturnValue(valueInStore);
    when(store.setGlobal).calledWith({ key: newKey, value: valueInStore }).mockReturnValue(true);

    await set.copyValue({ args: { sourceVar: storeKey, destinationVar: newKey } });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: VARIABLE_FORMAT_ERR, type: MESSAGE_TYPE.ERROR });
    expect(store.getGlobal).not.toHaveBeenCalled();
    expect(store.setGlobal).not.toHaveBeenCalled();
  });

  test('set function should set a given value to a given variable', async () => {
    const storeVar = `$${uuid()}`;
    const value = uuid();

    store.setGlobal = jest.fn();
    logger.emitLogs = jest.fn();

    when(store.setGlobal).calledWith({ key: storeVar, value }).mockReturnValue(true);

    await set.setValue({ args: { storeVar, value } });
    expect(store.setGlobal).toHaveBeenCalledWith({ key: storeVar, value });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: `Initialized variable as: "${storeVar}: ${value}"`, type: MESSAGE_TYPE.INFO });
  });

  test('set function should not set a value if the variable is not prefixed with "$"', async () => {
    const storeVar = `${uuid()}`;
    const value = uuid();

    store.setGlobal = jest.fn();
    logger.emitLogs = jest.fn();

    when(store.setGlobal).calledWith({ key: storeVar, value }).mockReturnValue(true);

    await set.setValue({ args: { storeVar, value } });
    expect(store.setGlobal).not.toHaveBeenCalled();
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: VARIABLE_FORMAT_ERR, type: MESSAGE_TYPE.ERROR });
  });
});
