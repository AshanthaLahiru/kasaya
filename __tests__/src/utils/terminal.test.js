/* eslint no-console: "off" */
const readline = require('readline');
const {
  init, promptQuestion, listen, execute, setMode, getMode, prompt,
} = require('../../../src/utils/terminal');

describe('terminal test suite', () => {
  test('prompt question should throw an error if read line interface is not found', async () => {
    let err;
    try {
      await promptQuestion('Do you wish to continue?');
    } catch (error) {
      err = error;
    }

    expect(err).toEqual(new Error('Kasāya REPL is not started'));
  });

  test('terminal should create new read line instance if no instance found', () => {
    readline.createInterface = jest.fn();
    const app = {};

    init(app);
    expect(readline.createInterface).toHaveBeenCalled();
  });

  test('terminal should return existing instance if an instance found', () => {
    readline.createInterface = jest.fn().mockReturnValue({});
    const app = {};

    const firstInstance = init(app);
    const secondInstance = init(app);
    expect(firstInstance).toBe(secondInstance);
  });

  test('terminal should prompt readline question and will receive an answer', async () => {
    const app = {};
    const readLineInterface = init(app);
    const mockAnswer = 'yes';
    readLineInterface.question = jest.fn((state, fn) => fn(mockAnswer));

    const returnedAnswer = await promptQuestion('Do you wish to continue?');
    expect(readLineInterface.question).toHaveBeenCalled();
    expect(returnedAnswer).toBe(returnedAnswer);
  });

  test('terminal should prompt readline question and select the default answer', async () => {
    const app = {};
    const readLineInterface = init(app);
    const defaultAnswer = 'No';
    readLineInterface.question = jest.fn((state, fn) => fn());

    const returnedAnswer = await promptQuestion('Do you wish to continue?', { default: defaultAnswer });
    expect(readLineInterface.question).toHaveBeenCalled();
    expect(returnedAnswer).toBe(returnedAnswer);
  });

  test('terminal should prompt readline question', () => {
    const app = {};
    const readLineInterface = init(app);
    readLineInterface.question = jest.fn();

    promptQuestion('Do you wish to continue?');
    expect(readLineInterface.question).toHaveBeenCalled();
  });

  test('terminal should trigger readline prompt when listen is called - valid input line', () => {
    const app = { send: jest.fn().mockResolvedValue('Success') };
    const readLineInterface = init(app);
    readLineInterface.prompt = jest.fn();
    readLineInterface.pause = jest.fn();
    const sendText = 'launch chrome';
    readLineInterface.on = jest.fn((state, fn) => fn(sendText));
    setMode('REPL');

    listen();
    expect(readLineInterface.prompt).toHaveBeenCalled();
    expect(readLineInterface.on).toHaveBeenCalled();
    expect(app.send).toHaveBeenCalledWith(sendText);
    expect(readLineInterface.pause).toHaveBeenCalled();
  });

  test('terminal should trigger readline prompt when listen is called - without valid input line', () => {
    const app = { send: jest.fn().mockResolvedValue('Success') };
    const readLineInterface = init(app);
    readLineInterface.prompt = jest.fn();
    readLineInterface.pause = jest.fn();
    readLineInterface.on = jest.fn((state, fn) => fn(undefined));
    setMode('REPL');

    listen();
    expect(readLineInterface.prompt).toHaveBeenCalled();
    expect(readLineInterface.on).toHaveBeenCalled();
    expect(app.send).not.toHaveBeenCalled();
    expect(readLineInterface.pause).not.toHaveBeenCalled();
  });

  test('terminal should trigger readline prompt when listen is called - valid input without string response', () => {
    const app = { send: jest.fn().mockResolvedValue({}) };
    const readLineInterface = init(app);
    readLineInterface.prompt = jest.fn();
    readLineInterface.pause = jest.fn();
    const sendText = 'launch chrome';
    readLineInterface.on = jest.fn((state, fn) => fn(sendText));
    setMode('REPL');
    console.log = jest.fn();

    listen();
    expect(readLineInterface.prompt).toHaveBeenCalled();
    expect(readLineInterface.on).toHaveBeenCalled();
    expect(app.send).toHaveBeenCalledWith(sendText);
    expect(readLineInterface.pause).toHaveBeenCalled();
    expect(console.log).not.toHaveBeenCalled();
  });

  test('terminal should validate readline-instance and trigger readline prompt when prompt is called', () => {
    const app = {};
    const readLineInterface = init(app);
    readLineInterface.prompt = jest.fn();

    prompt();
    expect(readLineInterface.prompt).toHaveBeenCalled();
  });

  test('terminal should send input string to app when execute is called', () => {
    const app = { send: jest.fn() };
    const readLineInterface = init(app);
    readLineInterface.prompt = jest.fn();

    const message = 'open google.lk';
    execute(message);
    expect(app.send).toHaveBeenCalledWith(message);
  });

  test('terminal should change the mode when set mode is called', () => {
    const mode = 'open google.lk';
    setMode(mode);
    expect(getMode()).toBe(mode);
  });
});
