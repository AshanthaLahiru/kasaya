const { when } = require('jest-when');
const uuid = require('uuid/v4');
const { findElements } = require('../../../../src/utils/browser/elementFinder');
const { simulateDragDrop } = require('../../../../src/utils/browser/common');
const drag = require('../../../../src/core/actions/drag');
const logger = require('../../../../src/utils/logger');
const { MESSAGE_TYPE } = require('../../../../src/constants');

describe('Drag test suite', () => {
  test('Drag command should simulate the drag when it found source and destination elements successfully', async () => {
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn(),
        $: jest.fn().mockResolvedValue({ elementId: uuid() }),
      },
    };
    logger.emitLogs = jest.fn();
    const sourceText = 'source';
    const destinationText = 'destination';
    const sourceXpath = [uuid()];
    const destinationXpath = [uuid()];
    const sourceElementId = uuid();
    const destinationElementId = uuid();

    when(state.browser.execute).calledWith(findElements, sourceText, undefined, true, false, false).mockResolvedValue({ success: true, targetResults: sourceXpath });
    when(state.browser.execute).calledWith(findElements, destinationText, undefined, true, false, false).mockResolvedValue({ success: true, targetResults: destinationXpath });
    when(state.browser.$).calledWith(sourceXpath[0]).mockResolvedValue({ elementId: sourceElementId });
    when(state.browser.$).calledWith(destinationXpath[0]).mockResolvedValue({ elementId: destinationElementId });

    await drag(state, { args: { source: sourceText, destination: destinationText } });
    expect(state.browser.execute).toHaveBeenCalledWith(simulateDragDrop, { elementId: sourceElementId }, { elementId: destinationElementId });
  });

  test('Drag command should log an error message when it cannot find the source or detination element', async () => {
    const state = {
      browser: {
        waitUntil: jest.fn((fn) => fn()),
        execute: jest.fn(),
        $: jest.fn().mockResolvedValue({ elementId: uuid() }),
      },
    };
    logger.emitLogs = jest.fn();
    const sourceText = 'source';
    const destinationText = 'destination';
    const sourceXpath = [uuid()];
    const destinationXpath = [uuid()];
    const sourceElementId = uuid();

    when(state.browser.execute).calledWith(findElements, sourceText, undefined, true, false, false).mockResolvedValue({ success: true, targetResults: sourceXpath });
    when(state.browser.execute).calledWith(findElements, destinationText, undefined, true, false, false).mockResolvedValue({ success: true, targetResults: destinationXpath });
    when(state.browser.$).calledWith(sourceXpath[0]).mockResolvedValue({ elementId: sourceElementId });
    when(state.browser.$).calledWith(destinationXpath[0]).mockResolvedValue(undefined);

    await drag(state, { args: { source: sourceText, destination: destinationText } });
    expect(logger.emitLogs).toHaveBeenCalledWith({ message: 'Something went wrong', type: MESSAGE_TYPE.ERROR });
  });
});
