const { validateBrowser } = require('../../utils/validate');
const { extractArgumentsFromText } = require('../../utils/buildRegex');
const logger = require('../../utils/logger');
const { BROWSER_EXECUTE_FUNC_ERR, MESSAGE_TYPE } = require('../../constants');
const store = require('../helpers/dataStore').store();
const functionExecutor = require('../../utils/browser/functionExecutor');

module.exports = async (state, { args }) => {
  const browser = validateBrowser(state);
  const { functionIdentifier, stringArgument } = args;

  if (browser) {
    if (functionIdentifier) {
      let parsedArgumentArray;
      if (stringArgument) {
        const argumentArray = extractArgumentsFromText(stringArgument);
        parsedArgumentArray = argumentArray ? argumentArray.map((argument) => {
          if (argument && argument.trim().startsWith('$')) {
            const value = store.getGlobal(argument.trim());
            return value;
          } else {
            return argument;
          }
        }) : null;
      } else if (args.argument1) {
        parsedArgumentArray = Object.keys(args)
          .filter((key) => key.startsWith('argument') && args[key] !== undefined)
          .map((key) => args[key]);
      }

      const executeFunctionStatus = await browser.execute(functionExecutor, functionIdentifier, parsedArgumentArray);
      if (executeFunctionStatus === undefined) {
        return logger.emitLogs({ message: `Function "${functionIdentifier}" was not found on the browser!`, type: MESSAGE_TYPE.ERROR });
      }
      if (executeFunctionStatus === null) {
        return logger.emitLogs({ message: BROWSER_EXECUTE_FUNC_ERR, type: MESSAGE_TYPE.ERROR });
      }
      return logger.emitLogs({ message: `Function "${functionIdentifier}" executed successfully on the browser.`, type: MESSAGE_TYPE.INFO });
    }
  }
};
