const axios = require('axios');
const store = require('../helpers/dataStore').store();
const logger = require('../../utils/logger');
const { MESSAGE_TYPE, VARIABLE_FORMAT_ERR } = require('../../constants');

module.exports = async ({ args: { method, url, varName } }) => {
  if (!varName.startsWith('$')) {
    return logger.emitLogs({ message: VARIABLE_FORMAT_ERR, type: MESSAGE_TYPE.ERROR });
  }
  try {
    const response = await axios[method](url);
    store.setGlobal({ key: varName, value: response.data });
    const stringResponse = JSON.stringify(response.data);
    return logger.emitLogs({ message: `Initialized variable as: "${varName}: ${stringResponse}"`, type: MESSAGE_TYPE.INFO });
  } catch (error) {
    return logger.emitLogs({ message: JSON.stringify(error.message), type: MESSAGE_TYPE.ERROR });
  }
};
