/* eslint no-console: "off" */
const chalk = require('chalk');
const {
  emitError, emitSuccess, emitInProgress, emitQuestion, emitUsageHelp, emitPlainText, emitInfo, emitWarn,
} = require('./../../../src/utils/messageEmitter');

describe('messageEmitter module test suite', () => {
  test('emitSuccess function should print success message in green', () => {
    console.log = jest.fn();

    const message = 'message to print';
    emitSuccess(message);
    expect(console.log).toHaveBeenCalledWith(chalk.green(`[*] ${message}`));
  });

  test('emitWarn function should print warning in red bright', () => {
    console.log = jest.fn();

    const message = 'message to print';
    emitWarn(message);
    expect(console.log).toHaveBeenCalledWith(chalk.redBright(`[!] ${message}`));
  });

  test('emitQuestion function should print question in yellow', () => {
    console.log = jest.fn();

    const message = 'message to print';
    emitQuestion(message);
    expect(console.log).toHaveBeenCalledWith(chalk.yellow(`[?] ${message}`));
  });

  test('emitInfo function should print info message in cyan', () => {
    console.log = jest.fn();

    const message = 'message to print';
    emitInfo(message);
    expect(console.log).toHaveBeenCalledWith(chalk.cyan(`[!] ${message}`));
  });

  test('emitInProgress function should print inProgress message in blue', () => {
    console.log = jest.fn();

    const message = 'message to print';
    emitInProgress(message);
    expect(console.log).toHaveBeenCalledWith(chalk.blue(`[...] ${message}`));
  });

  test('emitPlainText function should print message', () => {
    console.log = jest.fn();

    const message = 'message to print';
    emitPlainText(message);
    expect(console.log).toHaveBeenCalledWith(message);
  });

  test('emitError function should print error message in red', () => {
    console.log = jest.fn();

    const message = 'message to print';
    emitError(message);
    expect(console.log).toHaveBeenCalledWith(chalk.red(`[x] ${message}`));
  });

  test('emitUsageHelp function should print help message in grey', () => {
    console.log = jest.fn();

    emitUsageHelp('baseCommand', 'description', 'message');
    expect(console.log).toHaveBeenCalledWith(chalk.grey(`Usage: 
        baseCommand - description
        message
        `));
  });
});
