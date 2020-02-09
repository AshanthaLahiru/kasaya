const { when } = require('jest-when');
const evaluate = require('../../../../src/core/actions/evaluate');
const store = require('../../../../src/core/helpers/dataStore').store();
const logger = require('../../../../src/utils/logger');
const {
  MESSAGE_TYPE, VARIABLE_FORMAT_ERR, EVALUATE_UNEXPECTED_ERR, EVALUATE_INVALID_ERR,
} = require('../../../../src/constants');

describe('evaluate action test suite', () => {
  test('evaluate command should evaluate a provided expression within "{}" and return the result', async () => {
    const firstVar = '$var1';
    const secondVar = '$var2';
    const expression = `{${firstVar}+${secondVar}}`;
    const result = '5';
    const varName = '$var3';
    const firstVarValueInStore = 2;
    const secondVarValueInStore = 3;

    store.getGlobal = jest.fn();
    store.setGlobal = jest.fn();
    logger.emitLogs = jest.fn();
    when(store.getGlobal).calledWith(firstVar).mockReturnValue(firstVarValueInStore);
    when(store.getGlobal).calledWith(secondVar).mockReturnValue(secondVarValueInStore);

    await evaluate({ args: { expression, varName } });
    expect(store.getGlobal).toHaveBeenCalledWith(firstVar);
    expect(store.setGlobal).toHaveBeenCalledWith({ key: varName, value: result });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: `Initialized variable as: "${varName}: ${result}"`, type: MESSAGE_TYPE.INFO });
  });

  test('evaluate command should log an error message if "{}" are not used to wrap the expression ', async () => {
    const firstVar = '$var1';
    const secondVar = '$var2';
    const expression = `${firstVar}+${secondVar}`;
    const varName = '$var3';

    store.getGlobal = jest.fn();
    store.setGlobal = jest.fn();
    logger.emitLogs = jest.fn();

    await evaluate({ args: { expression, varName } });
    expect(store.getGlobal).not.toHaveBeenCalled();
    expect(store.setGlobal).not.toHaveBeenCalled();
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: EVALUATE_INVALID_ERR, type: MESSAGE_TYPE.ERROR });
  });

  test('evaluate command should log an error message if destination varName does not start with a "$"', async () => {
    const firstVar = '$var1';
    const secondVar = '$var2';
    const expression = `${firstVar}+${secondVar}`;
    const varName = 'var3';

    store.getGlobal = jest.fn();
    store.setGlobal = jest.fn();
    logger.emitLogs = jest.fn();

    await evaluate({ args: { expression, varName } });
    expect(store.getGlobal).not.toHaveBeenCalled();
    expect(store.setGlobal).not.toHaveBeenCalled();
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: VARIABLE_FORMAT_ERR, type: MESSAGE_TYPE.ERROR });
  });

  test('evaluate command should log an error message if an error occurs while evaluating the expression', async () => {
    const firstVar = '$var1';
    const secondVar = '$var2';
    const expression = `{${firstVar}+${secondVar}}`;
    const varName = '$var3';
    const firstVarValueInStore = 'invalid';
    const secondVarValueInStore = 'invalid';

    store.getGlobal = jest.fn();
    store.setGlobal = jest.fn();
    logger.emitLogs = jest.fn();
    evaluate.indirectEval = jest.fn(() => {
      throw new Error();
    });

    when(store.getGlobal).calledWith(firstVar).mockReturnValue(firstVarValueInStore);
    when(store.getGlobal).calledWith(secondVar).mockReturnValue(secondVarValueInStore);

    await evaluate({ args: { expression, varName } });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: EVALUATE_UNEXPECTED_ERR, type: MESSAGE_TYPE.ERROR });
  });
});
