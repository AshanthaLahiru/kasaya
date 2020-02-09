const messageEmitter = require('../../utils/messageEmitter');

let _commands;

/**
 * Displays usage information of set of registered commands.
 * Lists down usage information for all sub-commands of a parent commands if @parentCommand is
 * specified, else lists down the usage information for all the commands
 */
module.exports = async ({ args: { parentCommand }, context }) => {
  _commands = context.commands;

  // returns the length of longest help command
  const getLongestCommandLength = (commands) => {
    if (commands !== undefined && commands.length !== 0) {
      const charCount = [];
      commands.map(
        ({ help }) => {
          if (help === undefined || help === '') {
            return;
          }
          return charCount.push(help.split('-')[0].length);
        },
      );
      return charCount.reduce((acc, curr) => (acc > curr ? acc : curr));
    }
  };

  // parentCommand here refers to specific category of commands (ex:- read). If specified, only the relevant sub commands
  // will be displayed (ex:- help read)
  if (parentCommand !== undefined) {
    const filteredCommands = _commands.filter(({ command }) => command.startsWith(parentCommand));
    if (filteredCommands !== undefined && filteredCommands.length !== 0) {
      const maxCharCount = getLongestCommandLength(filteredCommands);
      messageEmitter.emitInfo(`Here are the matching help entries for '${parentCommand}':`);
      filteredCommands.map(({ help }) => {
        if (help === undefined || help === '') {
          return;
        }
        return messageEmitter.emitHelp(help, maxCharCount);
      });
    }
  } else {
    messageEmitter.emitInfo('These are common Kasāya commands used in various situations:');
    const maxCharCount = getLongestCommandLength(_commands);
    _commands.map(({ help }) => {
      if (help === undefined || help === '') {
        return;
      }
      return messageEmitter.emitHelp(help, maxCharCount);
    });
  }
};
