const store = require('../helpers/dataStore').store();
const logger = require('../../utils/logger');
const { MESSAGE_TYPE, VARIABLE_FORMAT_ERR } = require('../../constants');

const copyValue = async ({ args: { sourceVar, destinationVar } }) => {
  if (!(destinationVar.startsWith('$') && sourceVar.startsWith('$'))) {
    return logger.emitLogs({ message: VARIABLE_FORMAT_ERR, type: MESSAGE_TYPE.ERROR });
  }
  const sourceValue = store.getGlobal(sourceVar);
  store.setGlobal({ key: destinationVar, value: sourceValue });
  logger.emitLogs({ message: `Initialized variable as: "${destinationVar}: ${sourceValue}"`, type: MESSAGE_TYPE.INFO });
};

const setValue = async ({ args: { storeVar, value } }) => {
  if (!(storeVar.startsWith('$'))) {
    return logger.emitLogs({ message: VARIABLE_FORMAT_ERR, type: MESSAGE_TYPE.ERROR });
  }
  store.setGlobal({ key: storeVar, value });
  logger.emitLogs({ message: `Initialized variable as: "${storeVar}: ${value}"`, type: MESSAGE_TYPE.INFO });
};

module.exports = {
  copyValue,
  setValue,
};
