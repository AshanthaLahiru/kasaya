const press = require('../../../../src/core/actions/press');
const messageEmitter = require('../../../../src/utils/messageEmitter');

let state;

const supportedKeys = {
  backspace: 'Backspace',
  tab: 'Tab',
  enter: 'Enter',
  shift: 'Shift',
  control: 'Control',
  alt: 'Alt',
  pause: 'Pause',
  escape: 'Escape',
  pageup: 'PageUp',
  pagedown: 'PageDown',
  end: 'End',
  home: 'Home',
  leftarrow: 'ArrowLeft',
  uparrow: 'ArrowUp',
  rightarrow: 'ArrowRight',
  downarrow: 'ArrowDown',
  arrowleft: 'ArrowLeft',
  arrowup: 'ArrowUp',
  arrowright: 'ArrowRight',
  arrowdown: 'ArrowDown',
  insert: 'Insert',
  delete: 'Delete',
};

describe('press command test suite', () => {
  beforeEach(() => {
    state = {
      browser: {
        keys: jest.fn(),
      },
    };
  });

  test('press function should simulate key press, if only one supported key is passed', async () => {
    state.browser.keys.mockResolvedValue(true);
    Object.keys(supportedKeys).forEach(async (key) => {
      await press(state, { args: { inputKeys: key } });
      expect(state.browser.keys).toHaveBeenCalledWith(supportedKeys[key]);
    });
  });

  test('press function should simulate key press, if multiple supported keys are passed', async () => {
    state.browser.keys.mockResolvedValue(true);

    await press(state, { args: { inputKeys: 'Backspace+Enter' } });
    expect(state.browser.keys).toHaveBeenCalledWith(['Backspace', 'Enter', 'NULL']);
  });

  test('press function should simulate key press, if only one unsupported key is passed', async () => {
    state.browser.keys.mockResolvedValue(true);
    messageEmitter.emitWarn = jest.fn();
    const unsupportedKey = 'some unsupported key';

    await press(state, { args: { inputKeys: unsupportedKey } });
    // expect(messageEmitter.emitWarn).toHaveBeenCalledWith(`Unknown key "${unsupportedKey}". Sending the sequence of characters ${[...unsupportedKey].join(',')} to the browser instead.`);
    expect(state.browser.keys).toHaveBeenCalledWith([unsupportedKey]);
  });

  // test('press function should simulate key press, if mixture of supported and unsupported keys are passed', async () => {
  //   state.browser.keys.mockResolvedValue(true);
  //   messageEmitter.emitWarn = jest.fn();

  //   await press(state, { args: { inputKeys: 'Enter+WrongKey' } });
  //   // expect(messageEmitter.emitWarn).toHaveBeenCalledWith('unsupported key(s) provided: "WrongKey"');
  //   expect(state.browser.keys).not.toHaveBeenCalled();
  // });

  test('press function should simulate key press, if mixture of supported and character keys are passed', async () => {
    state.browser.keys.mockResolvedValue(true);
    messageEmitter.emitWarn = jest.fn();

    await press(state, { args: { inputKeys: 'Enter+S' } });
    expect(state.browser.keys).toHaveBeenCalledWith(['Enter', 'S', 'NULL']);
  });
});
