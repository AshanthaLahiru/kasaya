const { validateBrowser } = require('../../utils/validate');
const logger = require('../../utils/logger');
const { MESSAGE_TYPE } = require('../../constants');
const { snapshotHelper } = require('../../utils/browser/snapshotHelper');
const store = require('../helpers/dataStore').store();

module.exports = async (state, { mode }, { args: { snapshotReference } }) => {
  const browser = validateBrowser(state);

  if (browser && snapshotReference) {
    if (mode === 'get') {
      const browserSnapshot = await browser.execute(snapshotHelper, mode, undefined);
      store.setGlobal({ key: snapshotReference, value: browserSnapshot });
      logger.emitLogs({ message: `Browser snapshot created as "${snapshotReference.replace('$', '')}"`, type: MESSAGE_TYPE.INFO });
    }
    if (mode === 'set') {
      const browserSnapshot = store.getGlobal(snapshotReference);
      await browser.execute(snapshotHelper, mode, browserSnapshot);
      await browser.refresh();
    }
  }
};
