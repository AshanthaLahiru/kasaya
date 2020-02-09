const { flattenDeep } = require('lodash');
const { ASSERTION, TEST } = require('../constants');
const messageEmitter = require('./messageEmitter');

const evaluateTest = (response) => {
  const flatResponse = flattenDeep(response);
  const isValidTestCase = flatResponse.find((atomicResponse) => (atomicResponse === ASSERTION.PASS || atomicResponse === ASSERTION.FAIL));

  if (isValidTestCase) {
    return flatResponse.find((atomicResponse) => atomicResponse === ASSERTION.FAIL) ? TEST.FAIL : TEST.PASS;
  }
};

const emitTestLog = ({ status, command }) => {
  const commandText = command.trim();
  if (status === TEST.PASS) {
    messageEmitter.emitTestSuccess(`${status} :: ${commandText}`);
  } else {
    messageEmitter.emitTestWarn(`${status} :: ${commandText}`);
  }
};

const emitTestSummary = (testCases) => {
  if (testCases) {
    const passingCount = testCases.filter((testCase) => testCase === TEST.PASS).length;
    const failingCount = testCases.length - passingCount;

    messageEmitter.emitTestSummary(`\nTOTAL: ${testCases.length} \t PASS: ${passingCount} \t FAIL: ${failingCount}\n`);
  }
};

const emitVerboseLog = ({ status, command }) => {
  const commandText = command.trim();
  messageEmitter.emitPlainText(`[-] ${status} :: ${commandText}\n`);
};

module.exports = {
  evaluateTest, emitTestLog, emitTestSummary, emitVerboseLog,
};
