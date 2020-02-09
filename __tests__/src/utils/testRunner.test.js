const {
  evaluateTest, emitTestLog, emitTestSummary, emitVerboseLog,
} = require('../../../src/utils/testRunner');
const messageEmitter = require('../../../src/utils/messageEmitter');
const { TEST } = require('../../../src/constants');

describe('evaluateTest test suite', () => {
  test('valid passing test case should return `TEST.PASS`', () => {
    const mockInput = ['TRUE', [undefined, undefined], undefined, undefined, 'TRUE'];
    expect(evaluateTest(mockInput)).toBe(TEST.PASS);
  });

  test('valid failing test case should return `TEST.FAIL`', () => {
    const mockInput = ['TRUE', [undefined, 'FALSE'], undefined, undefined, 'TRUE'];
    expect(evaluateTest(mockInput)).toBe(TEST.FAIL);
  });

  test('invalid test case should return undefined', () => {
    const mockInput = [undefined, [undefined, null], undefined];
    expect(evaluateTest(mockInput)).toBe(undefined);
  });
});

describe('emitTestLog test suite', () => {
  test('passing test log', () => {
    const mockInput = {
      command: 'verify user sign in',
      status: 'PASS',
    };
    messageEmitter.emitTestSuccess = jest.fn();
    emitTestLog(mockInput);
    expect(messageEmitter.emitTestSuccess).toHaveBeenCalledWith(`${mockInput.status} :: ${mockInput.command}`);
  });

  test('failing test log', () => {
    const mockInput = {
      command: 'verify user sign in',
      status: 'FAIL',
    };
    messageEmitter.emitTestWarn = jest.fn();
    emitTestLog(mockInput);
    expect(messageEmitter.emitTestWarn).toHaveBeenCalledWith(`${mockInput.status} :: ${mockInput.command}`);
  });
});

describe('emitTestSummary test suite', () => {
  test('valid test list log test summary', () => {
    const mockInput = ['PASS', 'PASS', 'FAIL'];
    messageEmitter.emitTestSummary = jest.fn();
    emitTestSummary(mockInput);
    expect(messageEmitter.emitTestSummary).toHaveBeenCalledWith('\nTOTAL: 3 \t PASS: 2 \t FAIL: 1\n');
  });

  test('invalid test list does not log anything', () => {
    const mockInput = null;
    messageEmitter.emitTestSummary = jest.fn();
    emitTestSummary(mockInput);
    expect(messageEmitter.emitTestSummary).not.toHaveBeenCalled();
  });
});

describe('emitVerboseLog test suite', () => {
  test('passing test log should log test status', () => {
    const mockInput = {
      command: 'verify user sign in',
      status: 'PASS',
    };
    messageEmitter.emitPlainText = jest.fn();
    emitVerboseLog(mockInput);
    expect(messageEmitter.emitPlainText).toHaveBeenCalledWith(`[-] ${mockInput.status} :: ${mockInput.command}\n`);
  });
});
