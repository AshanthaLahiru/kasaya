const Terminal = require('../utils/terminal');
const messageEmitter = require('../utils/messageEmitter');
const {
  MODES, MESSAGE_TYPE, ASSERTION, INVALID_MODE,
} = require('../constants');

/**
 * checks whether the message is an error message
 * if so returns the assertion fail to mark it as a failed test
 * else returns the original message
 */
const validateLog = (message, type) => {
  if (type === MESSAGE_TYPE.ERROR) {
    return ASSERTION.FAIL;
  } else {
    return message;
  }
};

/**
 * control the log messages according to the mode
 * if the mode is invalid, exits the process
 */
const emitLogs = ({ message, type }) => {
  const mode = Terminal.getMode();

  switch (mode) {
    case MODES.TEST: {
      return validateLog(message, type);
    }
    case MODES.TEST_STRICT: {
      return validateLog(message, type);
    }
    case MODES.REPL: {
      messageEmitter[type](message);
      return validateLog(message, type);
    }
    case MODES.VERBOSE: {
      messageEmitter[type](message);
      return validateLog(message, type);
    }
    default: {
      messageEmitter.emitWarn(INVALID_MODE);
      process.exit(-1);
    }
  }
};

module.exports = { emitLogs };
