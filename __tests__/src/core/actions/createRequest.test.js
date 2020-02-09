const axios = require('axios');
const createRequest = require('../../../../src/core/actions/createRequest');
const store = require('../../../../src/core/helpers/dataStore').store();
const logger = require('../../../../src/utils/logger');
const { MESSAGE_TYPE, VARIABLE_FORMAT_ERR } = require('../../../../src/constants');

describe('createRequest command test suite ', () => {
  test('createRequest action should be able to create a get request to a specified endpoint and store response data',
    async () => {
      const users = [{ name: 'Bob' }];
      const testResponse = { data: users };
      const method = 'get';
      const url = 'http://testUrl';
      const varName = '$testVar';

      logger.emitLogs = jest.fn();
      store.setGlobal = jest.fn();
      axios.get = jest.fn();
      axios.get.mockResolvedValue(testResponse);

      await createRequest({ args: { method, url, varName } });
      expect(logger.emitLogs).toHaveBeenCalledWith({ message: `Initialized variable as: "${varName}: ${JSON.stringify(users)}"`, type: MESSAGE_TYPE.INFO });
    });

  test('createRequest action should emit a specific error message if unable to fetch data',
    async () => {
      const method = 'get';
      const url = 'http://testUrl';
      const varName = '$testVar';

      logger.emitLogs = jest.fn();
      store.setGlobal = jest.fn();
      axios.get = jest.fn(() => {
        throw new Error('Something went wrong');
      });

      await createRequest({ args: { method, url, varName } });
      expect(logger.emitLogs).toHaveBeenCalledWith({ message: JSON.stringify('Something went wrong'), type: MESSAGE_TYPE.ERROR });
    });

  test('createRequest action should emit an error message if varName does not start with a "$"',
    async () => {
      const method = 'get';
      const url = 'http://testUrl';
      const varName = 'testVar';

      logger.emitLogs = jest.fn();

      await createRequest({ args: { method, url, varName } });
      expect(logger.emitLogs).toHaveBeenCalledWith({ message: VARIABLE_FORMAT_ERR, type: MESSAGE_TYPE.ERROR });
    });
});
