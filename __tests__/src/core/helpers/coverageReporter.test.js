const { fetchCoverage } = require('../../../../src/core/helpers/coverageReporter');
const store = require('../../../../src/core/helpers/dataStore').store();
const logger = require('../../../../src/utils/logger');

describe('coverage reporter test suite', () => {
  test('fetch coverage object when the coverage collecting array is not created should create new coverage collecting array', async () => {
    const mockSnapshot = { coverage: 'coverage_object' };
    const state = {
      browser: {
        execute: jest.fn().mockResolvedValue(mockSnapshot),
      },
    };
    store.setGlobal = jest.fn();
    logger.emitLogs = jest.fn();

    await fetchCoverage(state);
    expect(state.coverage).toEqual([mockSnapshot]);
  });

  test('fetch coverage object when the coverage collecting array is created should push the coverage object to existing array', async () => {
    const mockSnapshot = { coverage: 'coverage_object' };
    const state = {
      browser: {
        execute: jest.fn().mockResolvedValue(mockSnapshot),
      },
      coverage: [{}],
    };
    store.setGlobal = jest.fn();
    logger.emitLogs = jest.fn();

    await fetchCoverage(state);
    expect(state.coverage).toEqual([{}, mockSnapshot]);
  });
});
