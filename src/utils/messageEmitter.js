/* eslint no-console: "off" */
const chalk = require('chalk');

function emitError(error) {
  if (error instanceof Error) {
    if (process.env.REPL_MODE === '1') {
      if (process.env.DEV_MODE === '1') {
        console.error(error);
      } else {
        console.log(chalk.red(`[x] ${error.message}`));
      }
    } else if (process.env.TEST_RUNNER_MODE === '1') {
      throw error;
    }
  } else {
    if (process.env.TEST_RUNNER_MODE === '1') {
      throw new Error(error);
    }
    console.log(chalk.red(`[x] ${error}`));
  }
}

function emitSuccess(message) {
  console.log(chalk.green(`[*] ${message}`));
}

function emitWarn(message) {
  console.log(chalk.redBright(`[!] ${message}`));
}

function emitQuestion(message) {
  console.log(chalk.yellow(`[?] ${message}`));
}

function emitInfo(message) {
  console.log(chalk.cyan(`[!] ${message}`));
}

function emitInProgress(message) {
  console.log(chalk.blue(`[...] ${message}`));
}

function emitUsageHelp(baseCommand, description, message) {
  console.log(chalk.grey(
    `Usage: 
        ${baseCommand} - ${description}
        ${message}
        `,
  ));
}

function emitPlainText(message) {
  console.log(message);
}

function emitTestSuccess(message) {
  console.log(chalk.green(`[\u2713] ${message}`));
}

function emitTestWarn(message) {
  console.log(chalk.redBright(`[X] ${message}`));
}

function emitTestSummary(message) {
  console.log(chalk.yellow(`${message}`));
}

function emitHelp(message, separatorCharCount) {
  const phrase = message.split('-');
  console.log(chalk.cyan(`\t${phrase[0].padEnd(separatorCharCount, '-')}-${phrase[1]}`));
}

module.exports = {
  emitError,
  emitSuccess,
  emitInProgress,
  emitQuestion,
  emitUsageHelp,
  emitPlainText,
  emitInfo,
  emitWarn,
  emitTestSuccess,
  emitTestWarn,
  emitTestSummary,
  emitHelp,
};
