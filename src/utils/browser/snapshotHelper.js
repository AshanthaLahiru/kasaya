function snapshotHelper(mode, browserSnapshotString) {
  function fetchSessionStorage() {
    const sessionStorageStore = {};
    for (let count = 0; count < window.sessionStorage.length; count += 1) {
      const key = window.sessionStorage.key(count);
      sessionStorageStore[key] = window.sessionStorage.getItem(key);
    }
    return sessionStorageStore;
  }

  function fetchLocalStorage() {
    const localStorageStore = {};
    for (let count = 0; count < window.localStorage.length; count += 1) {
      const key = window.localStorage.key(count);
      localStorageStore[key] = window.localStorage.getItem(key);
    }
    return localStorageStore;
  }

  function clearSessionStorage() {
    window.sessionStorage.clear();
  }

  function clearLocalStorage() {
    window.localStorage.clear();
  }

  function clearBrowserStore() {
    clearLocalStorage();
    clearSessionStorage();
  }

  function setSessionStorage(sessionStorageStore) {
    Object.keys(sessionStorageStore).forEach((key) => {
      window.sessionStorage.setItem(key, sessionStorageStore[key]);
    });
  }

  function setLocalStorage(localStorageStore) {
    Object.keys(localStorageStore).forEach((key) => {
      window.localStorage.setItem(key, localStorageStore[key]);
    });
  }

  if (mode === 'set') {
    const browserSnapshot = JSON.parse(browserSnapshotString);
    clearBrowserStore();
    if (browserSnapshot && browserSnapshot.sessionStorage) {
      setSessionStorage(browserSnapshot.sessionStorage);
    }
    if (browserSnapshot && browserSnapshot.localStorage) {
      setLocalStorage(browserSnapshot.localStorage);
    }
  }

  if (mode === 'get') {
    const browserSnapshot = {
      sessionStorage: fetchSessionStorage(),
      localStorage: fetchLocalStorage(),
    };

    const stringifiedBrowserSnapshot = JSON.stringify(browserSnapshot);
    return stringifiedBrowserSnapshot;
  }
}

module.exports = { snapshotHelper };
