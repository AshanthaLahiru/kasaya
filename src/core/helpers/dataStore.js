class DataStore {
  constructor() {
    this._locals = [];
    this._globals = {};
  }

  setLocal({ context, key, value }) {
    this._locals.push({ context, key, value });
  }

  setGlobal({ key, value }) {
    if (key.startsWith('$')) {
      this._globals[key] = value;
    } else {
      this._globals[`$${key}`] = value;
    }
  }

  getGlobal(key) {
    if (key.startsWith('$')) {
      return this._globals[key];
    }
    return undefined;
  }

  getLocal(key, context) {
    return this._locals.find((l) => l.context === context && l.key === key);
  }

  clearGlobals() {
    this._globals = {};
  }

  clearLocals({ context }) {
    this._locals = this._locals.filter((lo) => lo.context !== context);
  }
}

// this is to make the datastore a singleton object across all the modules

module.exports = {
  _store: null,
  store() {
    if (this._store === null) {
      this._store = new DataStore();
    }
    return this._store;
  },
};
