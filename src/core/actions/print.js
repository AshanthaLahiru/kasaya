const store = require('../helpers/dataStore').store();
const logger = require('../../utils/logger');
const { NO_VARIABLE_FOUND, MESSAGE_TYPE } = require('../../constants');

module.exports = async ({ args: { variable } }) => {
  if (variable && variable.startsWith('$')) {
    const value = store.getGlobal(variable);
    if (value) {
      logger.emitLogs({ message: value, type: MESSAGE_TYPE.INFO });
    } else {
      logger.emitLogs({ message: NO_VARIABLE_FOUND, type: MESSAGE_TYPE.INFO });
    }
  } else {
    logger.emitLogs({ message: variable, type: MESSAGE_TYPE.INFO });
  }
};
