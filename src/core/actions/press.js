const { validateBrowser } = require('../../utils/validate');

module.exports = async (state, { args: { inputKeys } }) => {
  const browser = validateBrowser(state);

  if (browser) {
    // TODO: Refactor support keys
    const keys = inputKeys.split('+');
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

    if (keys.length === 1) {
      const key = supportedKeys[keys[0].toLowerCase()];
      if (!key) {
        // messageEmitter.emitWarn(`Unknown key "${keys[0]}". Sending the sequence of characters ${[...keys[0]].join(',')} to the browser instead.`);
        await browser.keys(keys);
        return;
      }
      await browser.keys(key);
      return;
    }

    const sequence = keys.map((key) => {
      const normalizedKey = key.toLowerCase();
      let keyCode = supportedKeys[normalizedKey];

      if (key.length === 1 && !keyCode) {
        keyCode = key; // support for characters
      }

      if (keyCode) {
        return {
          input: key,
          valid: true,
          keyCode,
        };
      }
      return { input: key, valid: false };
    });

    // pass 'NULL' to release the modifier key
    sequence.push({ keyCode: 'NULL' });

    // const unsupportedKeys = sequence.filter((k) => k.valid === false);
    // if (unsupportedKeys.length > 0) {
    //   const keyList = unsupportedKeys.map((k) => k.input).join(',');
    //   messageEmitter.emitWarn(`unsupported key(s) provided: "${keyList}"`);
    //   return;
    // }

    browser.keys(sequence.map((k) => k.keyCode));
  }
};
