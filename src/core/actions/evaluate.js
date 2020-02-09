const store = require('../helpers/dataStore').store();
const logger = require('../../utils/logger');
const {
  MESSAGE_TYPE, VARIABLE_FORMAT_ERR, EVALUATE_UNEXPECTED_ERR, EVALUATE_INVALID_ERR,
} = require('../../constants');

module.exports = async ({ args: { expression, varName } }) => {
  if (!varName.startsWith('$')) {
    return logger.emitLogs({ message: VARIABLE_FORMAT_ERR, type: MESSAGE_TYPE.ERROR });
  }
  const matchingString = expression.match(/{(.*?)}/);
  if (matchingString) {
    try {
      let extractedExpression = matchingString[1].replace(/\s+/g, '');
      const regex = new RegExp(/\$(\w+)/g);
      let match;
      const matches = [];
      do {
        match = regex.exec(extractedExpression);
        if (match) {
          matches.push(match[1]);
        }
      } while (match);
      if (matches && matches.length) {
        matches.forEach((matchedItem) => {
          const value = store.getGlobal(`$${matchedItem}`);
          const regExp = new RegExp(`\\$${matchedItem}`, 'g');
          extractedExpression = extractedExpression.replace(regExp, value);
        });
      }
      const indirectEval = eval;
      const result = indirectEval(extractedExpression);
      store.setGlobal({ key: varName, value: result.toString() });
      return logger.emitLogs({ message: `Initialized variable as: "${varName}: ${result}"`, type: MESSAGE_TYPE.INFO });
    } catch (err) {
      return logger.emitLogs({ message: EVALUATE_UNEXPECTED_ERR, type: MESSAGE_TYPE.ERROR });
    }
  } else {
    return logger.emitLogs({ message: EVALUATE_INVALID_ERR, type: MESSAGE_TYPE.ERROR });
  }
};
