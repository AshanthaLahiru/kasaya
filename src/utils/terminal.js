/* eslint no-console: "off" */
const readline = require('readline'); // and connected to a command line
const chalk = require('chalk');

let readLineInterface;
let _app;
let _mode;

const init = (app) => {
  _app = app;
  if (readLineInterface) {
    return readLineInterface;
  }
  readLineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: chalk.green('Kasāya> '),
  });
  return readLineInterface;
};

const promptQuestion = (question, options = { default: '' }) => new Promise((resolve, reject) => {
  if (!readLineInterface) {
    reject(new Error('Kasāya REPL is not started'));
  }

  readLineInterface.question(chalk.yellow(`[?] ${question}`), (answer) => {
    if (answer) resolve(answer);
    else resolve(options.default);
  });
});

const listen = () => {
  readLineInterface.prompt();
  readLineInterface.on('line', async (line) => {
    if (line === '') {
      readLineInterface.prompt();
    } else if (line) {
      readLineInterface.pause();
      const res = await _app.send(line.trim());
      if (res && _mode === 'REPL' && typeof res === 'string') console.log(chalk.cyanBright(res));
      readLineInterface.prompt();
    }
  });
};

const prompt = () => {
  if (readLineInterface) readLineInterface.prompt();
};

const execute = async (command) => _app.send(command);

const setMode = (mode) => {
  _mode = mode;
};

const getMode = () => _mode;

module.exports = {
  init,
  promptQuestion,
  listen,
  execute,
  setMode,
  getMode,
  prompt,
};
