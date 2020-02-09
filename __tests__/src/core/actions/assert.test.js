const uuid = require('uuid/v4');
const { when } = require('jest-when');
const assert = require('../../../../src/core/actions/assert').common;
const store = require('../../../../src/core/helpers/dataStore').store();
const logger = require('../../../../src/utils/logger');
const sampleResp = require('../../../__mocks__/sampleResp.json');
const { ASSERTION, MESSAGE_TYPE } = require('../../../../src/constants');

describe('assert action test suite', () => {
  test('assert command should emit an information message with text "True" if the "equals" assertion is true', async () => {
    const storeKey = `$${uuid()}`;
    const valueInStore = uuid();

    store.getGlobal = jest.fn();
    logger.emitLogs = jest.fn();
    when(store.getGlobal).calledWith(storeKey).mockReturnValue(valueInStore);

    await assert({ args: { actualVal: storeKey, expectedVal: valueInStore } });
    expect(store.getGlobal).toHaveBeenCalledTimes(1);
    expect(store.getGlobal).toHaveBeenCalledWith(storeKey);
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: ASSERTION.PASS, type: MESSAGE_TYPE.INFO });
  });

  test('assert command should emit an information message with text "False" if the "equals" assertion is false', async () => {
    const storeKey = `$${uuid()}`;
    const valueInStore = uuid();

    store.getGlobal = jest.fn();
    logger.emitLogs = jest.fn();
    when(store.getGlobal).calledWith(storeKey).mockReturnValue(valueInStore);

    await assert({ args: { actualVal: storeKey, expectedVal: uuid() } }); // expecting for another value other than the the valueInStore
    expect(store.getGlobal).toHaveBeenCalledTimes(1);
    expect(store.getGlobal).toHaveBeenCalledWith(storeKey);
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: ASSERTION.FAIL, type: MESSAGE_TYPE.INFO });
  });

  test('assert command should emit an information message with text "True" if the "not equals" assertion is true', async () => {
    const storeKey = `$${uuid()}`;
    const valueInStore = 'abc';

    store.getGlobal = jest.fn();
    logger.emitLogs = jest.fn();
    when(store.getGlobal).calledWith(storeKey).mockReturnValue(valueInStore);

    await assert({ args: { actualVal: storeKey, notExpectedVal: uuid() } }); // expecting a random uuid not to be equal to the string 'abc'
    expect(store.getGlobal).toHaveBeenCalledTimes(1);
    expect(store.getGlobal).toHaveBeenCalledWith(storeKey);
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: ASSERTION.PASS, type: MESSAGE_TYPE.INFO });
  });

  test('assert command should emit an information message with text "False" if the "not equals" assertion is false', async () => {
    const storeKey = `$${uuid()}`;
    const valueInStore = uuid();

    store.getGlobal = jest.fn();
    logger.emitLogs = jest.fn();
    when(store.getGlobal).calledWith(storeKey).mockReturnValue(valueInStore);

    await assert({ args: { actualVal: storeKey, notExpectedVal: valueInStore } });
    expect(store.getGlobal).toHaveBeenCalledTimes(1);
    expect(store.getGlobal).toHaveBeenCalledWith(storeKey);
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: ASSERTION.FAIL, type: MESSAGE_TYPE.INFO });
  });

  test('assert command should emit an information message with text "True" if the "equals" assertion is true in variable assertions', async () => {
    const storeKeyOne = `$${uuid()}`;
    const storeKeyTwo = `$${uuid()}`;
    const valueInStore = uuid();

    store.getGlobal = jest.fn();
    logger.emitLogs = jest.fn();
    when(store.getGlobal).calledWith(storeKeyOne).mockReturnValue(valueInStore);
    when(store.getGlobal).calledWith(storeKeyTwo).mockReturnValue(valueInStore);

    await assert({ args: { actualVal: storeKeyOne, expectedVal: storeKeyTwo } });
    expect(store.getGlobal).toHaveBeenCalledTimes(2);
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: ASSERTION.PASS, type: MESSAGE_TYPE.INFO });
  });

  test('assert command should emit an information message with text "False" if the "equals" assertion is false in variable assertions', async () => {
    const storeKeyOne = `$${uuid()}`;
    const storeKeyTwo = `$${uuid()}`;

    store.getGlobal = jest.fn();
    logger.emitLogs = jest.fn();
    when(store.getGlobal).calledWith(storeKeyOne).mockReturnValue(uuid());
    when(store.getGlobal).calledWith(storeKeyTwo).mockReturnValue(uuid());

    await assert({ args: { actualVal: storeKeyOne, expectedVal: storeKeyTwo } });
    expect(store.getGlobal).toHaveBeenCalledTimes(2);
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: ASSERTION.FAIL, type: MESSAGE_TYPE.INFO });
  });

  test('assert command should emit an information message with text "True" if the "not equals" assertion is true in variable assertions', async () => {
    const storeKeyOne = `$${uuid()}`;
    const storeKeyTwo = `$${uuid()}`;

    store.getGlobal = jest.fn();
    logger.emitLogs = jest.fn();
    when(store.getGlobal).calledWith(storeKeyOne).mockReturnValue(uuid());
    when(store.getGlobal).calledWith(storeKeyTwo).mockReturnValue(uuid());

    await assert({ args: { actualVal: storeKeyOne, notExpectedVal: storeKeyTwo } });
    expect(store.getGlobal).toHaveBeenCalledTimes(2);
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: ASSERTION.PASS, type: MESSAGE_TYPE.INFO });
  });

  test('assert command should emit an information message with text "False" if the "not equals" assertion is false in variable assertions', async () => {
    const storeKeyOne = `$${uuid()}`;
    const storeKeyTwo = `$${uuid()}`;
    const valueInStore = uuid();

    store.getGlobal = jest.fn();
    logger.emitLogs = jest.fn();
    when(store.getGlobal).calledWith(storeKeyOne).mockReturnValue(valueInStore);
    when(store.getGlobal).calledWith(storeKeyTwo).mockReturnValue(valueInStore);

    await assert({ args: { actualVal: storeKeyOne, notExpectedVal: storeKeyTwo } });
    expect(store.getGlobal).toHaveBeenCalledTimes(2);
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: ASSERTION.FAIL, type: MESSAGE_TYPE.INFO });
  });

  test('assert command should emit an information message with text "True" if the "equals" assertion is true when an object property is accessed', async () => {
    const storeKey = '$donut';
    const valueInStore = sampleResp;

    store.getGlobal = jest.fn();
    logger.emitLogs = jest.fn();
    when(store.getGlobal).calledWith(storeKey).mockReturnValue(valueInStore);

    await assert({ args: { actualVal: "$donut['batters']['batter][1]['type]", expectedVal: 'Chocolate' } });
    expect(store.getGlobal).toHaveBeenCalledTimes(1);
    expect(store.getGlobal).toHaveBeenCalledWith(storeKey);
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: ASSERTION.PASS, type: MESSAGE_TYPE.INFO });
  });

  test('assert command should emit an information message with text "False" if the "equals" assertion is false or object property is unavailable when accessing object properties', async () => {
    const storeKey = '$donut';
    const valueInStore = sampleResp;

    store.getGlobal = jest.fn();
    logger.emitLogs = jest.fn();
    when(store.getGlobal).calledWith(storeKey).mockReturnValue(valueInStore);

    await assert({ args: { actualVal: '$donut[\'batters\'][\'batter\'][1][\'type]', expectedVal: 'Blueberry' } });
    expect(store.getGlobal).toHaveBeenCalledTimes(1);
    expect(store.getGlobal).toHaveBeenCalledWith(storeKey);
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: ASSERTION.FAIL, type: MESSAGE_TYPE.INFO });
  });

  test('assert command should emit an information message with text "True" if the "not equals" assertion is true when accessing object properties', async () => {
    const storeKey = '$donut';
    const valueInStore = sampleResp;

    store.getGlobal = jest.fn();
    logger.emitLogs = jest.fn();
    when(store.getGlobal).calledWith(storeKey).mockReturnValue(valueInStore);

    await assert({ args: { actualVal: '$donut[\'batters\'][\'batter\'][1][\'type]', notExpectedVal: 'Blueberry' } });
    expect(store.getGlobal).toHaveBeenCalledTimes(1);
    expect(store.getGlobal).toHaveBeenCalledWith(storeKey);
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: ASSERTION.PASS, type: MESSAGE_TYPE.INFO });
  });

  test('assert command should emit an information message with text "False" if the "not equals" assertion is false when accessing object properties', async () => {
    const storeKey = '$donut';
    const valueInStore = sampleResp;

    store.getGlobal = jest.fn();
    logger.emitLogs = jest.fn();
    when(store.getGlobal).calledWith(storeKey).mockReturnValue(valueInStore);

    await assert({ args: { actualVal: '$donut[\'batters\'][\'batter\'][1][\'type]', notExpectedVal: 'Chocolate' } });
    expect(store.getGlobal).toHaveBeenCalledTimes(1);
    expect(store.getGlobal).toHaveBeenCalledWith(storeKey);
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: ASSERTION.FAIL, type: MESSAGE_TYPE.INFO });
  });
});
