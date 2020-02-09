const messageEmitter = require('../../../../src/utils/messageEmitter');
const help = require('../../../../src/core/actions/help');

describe('help command test suite', () => {
  const context = {
    commands: [{
      command: 'greet $name',
      help: 'greet John - Greets a specified person',
      handler: ({ args }) => `Hello ${args.name}`,
    }, {
      command: 'run hello',
      help: 'run hello - Print "Hello"',
      handler: () => 'Hello',
    }],
  };
  const maxCommandLength = context.commands[0].command.length;

  test('help action should display all the commands when "help" is typed', async () => {
    messageEmitter.emitInfo = jest.fn();
    messageEmitter.emitHelp = jest.fn();

    await help({ args: { parentCommand: undefined }, context });
    expect(messageEmitter.emitInfo).toHaveBeenCalledWith('These are common Kasāya commands used in various situations:');
    expect(messageEmitter.emitHelp).toHaveBeenCalledWith('greet John - Greets a specified person', maxCommandLength);
    expect(messageEmitter.emitHelp).toHaveBeenCalledWith('run hello - Print "Hello"', maxCommandLength);
  });

  test('help action should display all the commands when command specific help is triggered', async () => {
    messageEmitter.emitInfo = jest.fn();
    messageEmitter.emitHelp = jest.fn();

    await help({ args: { parentCommand: 'greet' }, context });
    expect(messageEmitter.emitInfo).toHaveBeenCalledWith('Here are the matching help entries for \'greet\':');
    expect(messageEmitter.emitHelp).toHaveBeenCalledWith('greet John - Greets a specified person', maxCommandLength);
  });
});
