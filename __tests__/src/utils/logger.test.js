const { emitLogs } = require('../../../src/utils/logger');
const messageEmitter = require('../../../src/utils/messageEmitter');
const {
  MODES, MESSAGE_TYPE, INVALID_MODE, ASSERTION,
} = require('../../../src/constants');
const Terminal = require('../../../src/utils/terminal');

describe('emitLogger test suite', () => {
  test('test mode logger should return the message string', () => {
    const mockInput = {
      message: 'Test log message',
      type: MESSAGE_TYPE.INFO,
    };
    Terminal.getMode = jest.fn().mockReturnValue(MODES.TEST);

    expect(emitLogs(mockInput)).toBe(mockInput.message);
  });

  test('error messages should returns assertion fail sataus', () => {
    const mockInput = {
      message: 'Test log message',
      type: MESSAGE_TYPE.ERROR,
    };
    Terminal.getMode = jest.fn().mockReturnValue(MODES.TEST);

    expect(emitLogs(mockInput)).toBe(ASSERTION.FAIL);
  });

  test('test-strict mode logger should return the message string', () => {
    const mockInput = {
      message: 'Test log message',
      type: MESSAGE_TYPE.INFO,
    };
    Terminal.getMode = jest.fn().mockReturnValue(MODES.TEST_STRICT);

    expect(emitLogs(mockInput)).toBe(mockInput.message);
  });

  test('repl mode logger should log and return the message string', () => {
    const mockInput = {
      message: 'Test log message',
      type: MESSAGE_TYPE.INFO,
    };
    Terminal.getMode = jest.fn().mockReturnValue(MODES.REPL);
    messageEmitter.emitInfo = jest.fn();

    expect(emitLogs(mockInput)).toBe(mockInput.message);
    expect(messageEmitter.emitInfo).toHaveBeenCalledWith(mockInput.message);
  });

  test('verbose mode logger should log and return the message string', () => {
    const mockInput = {
      message: 'Test log message',
      type: MESSAGE_TYPE.INFO,
    };
    Terminal.getMode = jest.fn().mockReturnValue(MODES.VERBOSE);
    messageEmitter.emitInfo = jest.fn();

    expect(emitLogs(mockInput)).toBe(mockInput.message);
    expect(messageEmitter.emitInfo).toHaveBeenCalledWith(mockInput.message);
  });

  test('verbose mode logger should log an error message when the given mode is inavlid', () => {
    const mockInput = {
      message: 'Test log message',
      type: MESSAGE_TYPE.INFO,
    };
    Terminal.getMode = jest.fn().mockReturnValue('Invalid Mode');
    messageEmitter.emitWarn = jest.fn();
    process.exit = jest.fn();

    emitLogs(mockInput);
    expect(messageEmitter.emitWarn).toHaveBeenCalledWith(INVALID_MODE);
    expect(process.exit).toHaveBeenCalled();
  });
});
