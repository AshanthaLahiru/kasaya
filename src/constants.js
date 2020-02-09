// Common
const ASSERTION = {
  PASS: 'TRUE',
  FAIL: 'FALSE',
};
const MESSAGE_TYPE = {
  INFO: 'emitInfo',
  ERROR: 'emitError',
  QUESTION: 'emitQuestion',
  WARNING: 'emitWarn',
  PLAIN: 'emitPlainText',
  PROCESSING: 'emitInProgress',
};
const HEADLESS_MESSAGE = 'Running in headless mode...';

// Test Runner
const TEST = {
  PASS: 'PASS',
  FAIL: 'FAIL',
};
const MODES = {
  TEST: 'test',
  TEST_STRICT: 'test-strict',
  VERBOSE: 'verbose',
  REPL: 'repl',
};

// Errors
const SEARCH_TIME_OUT = 'Are you sure?';
const BROWSER_ERR = 'Failed to open browser!';
const CLOSE_ERR = 'Incorrect usage. "close" command currently supports "window" or "tab" as parameters!';
const CLEAR_ERR = 'Incorrect usage of command. Accepted parameters are, "text", "input" or "highlights"!';
const BROWSER_DETACHED_ERR = 'Browser window is detached and could not be closed. Please close it manually. Exiting Kasāya!';
const NAVIGATION_ERR = 'Unrecognized parameter. "go" command supports only back/forward as parameters!';
const NO_VARIABLE_FOUND = 'No such a variable!';
const INSPECT_ERR = 'Something went wrong while identifying your element. Please try again!';
const BROWSER_LAUNCH_ERR = 'Could not launch browser!';
const VARIABLE_FORMAT_ERR = 'Variable name should start with a "$"!';
const EVALUATE_UNEXPECTED_ERR = 'Something went wrong while evaluating the expression!';
const EVALUATE_INVALID_ERR = 'Invalid Syntax! Use {} to wrap the expression!';
const MOCK_CREATE_ERR = 'Mock response cannot be created!';
const MOCK_REMOVE_ERR = 'Mock response cannot be removed!';
const URL_READ_ERR = 'Requested parameters could not be extracted from the browser url!';
const TITLE_READ_ERR = 'Requested parameters could not be extracted from the page title!';
const ALERT_READ_ERR = 'Requested parameters could not be extracted from the current alert dialog box!';
const BROWSER_LOAD_ERR = 'Browser load operation timed out!';
const SWITCH_ERR = 'Incorrect usage. "switch" command currently supports "window" or "tab" as parameters!';
const ACTIVE_ELEMENT_ERR = 'Currently active element does not accept text input!';
const TIME_UNIT_ERR = 'Incorrect value for time, please enter the time in seconds!';
const ELEMENT_CLEAR_ERR = 'Something went wrong while clearing your element!';
const ALERT_HANDLE_ERR = 'Something went wrong while handling the alert!';
const BROWSER_EXECUTE_FUNC_ERR = 'Something went wrong while executing the browser function!';
const INVALID_MODE = 'Not a valid mode';

module.exports = {
  SEARCH_TIME_OUT,
  ASSERTION,
  MESSAGE_TYPE,
  BROWSER_ERR,
  CLEAR_ERR,
  CLOSE_ERR,
  BROWSER_DETACHED_ERR,
  NAVIGATION_ERR,
  NO_VARIABLE_FOUND,
  TEST,
  MODES,
  INSPECT_ERR,
  BROWSER_LAUNCH_ERR,
  HEADLESS_MESSAGE,
  VARIABLE_FORMAT_ERR,
  EVALUATE_UNEXPECTED_ERR,
  EVALUATE_INVALID_ERR,
  MOCK_CREATE_ERR,
  MOCK_REMOVE_ERR,
  URL_READ_ERR,
  ALERT_READ_ERR,
  BROWSER_LOAD_ERR,
  TITLE_READ_ERR,
  SWITCH_ERR,
  ACTIVE_ELEMENT_ERR,
  TIME_UNIT_ERR,
  ELEMENT_CLEAR_ERR,
  ALERT_HANDLE_ERR,
  BROWSER_EXECUTE_FUNC_ERR,
  INVALID_MODE,
};
