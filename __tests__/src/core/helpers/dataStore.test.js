const uuid = require('uuid/v4');
const store = require('../../../../src/core/helpers/dataStore').store();

describe('data store suite', () => {
  test('data store should store and retrieve locally with context, key and value', () => {
    const context = uuid();
    const key = uuid();
    const value = uuid();

    store.setLocal({ context, key, value });
    expect(store.getLocal(key, context)).toEqual({ context, key, value });
  });


  test('data store should store and retrieve globally with key (starting with $) and value', () => {
    const key = `$${uuid()}`;
    const value = uuid();

    store.setGlobal({ key, value });
    expect(store.getGlobal(key)).toEqual(value);
  });

  test('data store should store and retrieve globally with key (starting without $) and value', () => {
    const key = uuid();
    const value = uuid();

    store.setGlobal({ key, value });
    expect(store.getGlobal(`$${key}`)).toEqual(value);
  });

  test('data store should return undefined in global retrieve with key (starting without $)', () => {
    const key = uuid();
    const value = uuid();

    store.setGlobal({ key, value });
    expect(store.getGlobal(key)).toBeUndefined();
  });

  test('data store should clear local storage when clearLocals method is called', () => {
    const context = uuid();
    const key = uuid();
    const value = uuid();

    store.setLocal({ context, key, value });
    store.clearLocals({ context });
    expect(store.getGlobal(key)).toBeUndefined();
  });

  test('data store should clear global storage when clearLocals method is called', () => {
    const key = uuid();
    const value = uuid();

    store.setGlobal({ key, value });
    store.clearGlobals();
    expect(store.getGlobal(key)).toBeUndefined();
  });
});
