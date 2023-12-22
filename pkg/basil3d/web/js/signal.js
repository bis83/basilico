
const $__signalSet = (signal, key, value) => {
  value = value || 0;
  const sig = signal[key];
  if (sig && !sig.hold) {
    sig.value = Math.max(0, value);
  }
};
const $__signalHold = (signal, key, value, hold) => {
  value = value || 0;
  hold = hold || false;
  const sig = signal[key];
  if (sig) {
    sig.value = Math.max(0, value);
    sig.hold = hold;
  }
};
const $__signalGet = (signal, key) => {
  const sig = signal[key];
  if (sig) {
    return sig.value;
  }
  return 0;
};

const $__signalHistory = (signal, key) => {
  const sig = signal[key];
  if (sig) {
    sig.history = sig.value;
  }
};
const $__signalAddDelta = (signal, key, value) => {
  value = value || 0;
  const sig = signal[key];
  if (sig && !sig.hold) {
    sig.value = Math.max(0, sig.history + value);
  }
};
const $__signalDelta = (signal, key) => {
  const sig = signal[key];
  if (sig) {
    return sig.value - sig.history;
  }
  return 0;
};

const $__gamepadTouched = (gamepad) => {
  if (!gamepad) {
    return false;
  }

  for (const b of gamepad.buttons) {
    if (b.value > 0.5) {
      return true;
    }
  }
  for (const a of gamepad.axes) {
    if (Math.abs(a) > 0.5) {
      return true;
    }
  }
  return false;
};

const $__signalInit = (signal) => {

  const signalReset = () => {
    for (const key in signal.keyboard) {
      $__signalHold(signal.map, signal.keyboard[key], 0, false);
    }
    for (const key of signal.mouse.button) {
      $__signalHold(signal.map, key, 0, false);
    }
  };
  const signalKeyboard = (ev, value, hold) => {
    if (!html_is_pointer_lock()) {
      return;
    }
    const key = signal.keyboard[ev.code];
    if (key) {
      $__signalHold(signal.map, key, value, hold);
      ev.preventDefault();
      signal.last = -1;
    }
  };
  const signalMouse = (ev, value, hold) => {
    if (!html_is_pointer_lock()) {
      return;
    }
    const key = signal.mouse.button[ev.button];
    if (key) {
      $__signalHold(signal.map, key, value, hold);
      ev.preventDefault();
      signal.last = -1;
    }
  };

  html_listen(document.body, "contextmenu", (ev) => {
    ev.preventDefault();
  });
  html_listen(window, "blur", (ev) => {
    signalReset();
  });
  html_listen(document, "click", (ev) => {
    if (!html_is_pointer_lock()) {
      html_pointer_lock();
      signalReset();
    }
  });
  html_listen(document, "keydown", (ev) => {
    signalKeyboard(ev, 1, true);
  });
  html_listen(document, "keyup", (ev) => {
    signalKeyboard(ev, 0, false);
  });
  html_listen(document, "mousedown", (ev) => {
    signalMouse(ev, 1, true);
  });
  html_listen(document, "mouseup", (ev) => {
    signalMouse(ev, 0, false);
  });
  html_listen(document, "mousemove", (ev) => {
    if (!html_is_pointer_lock()) {
      return;
    }
    const mouseSensitive = 0.25;
    const movementX = signal.mouse.movementX;
    if (movementX) {
      $__signalSet(signal.map, movementX[0], -ev.movementX * mouseSensitive);
      $__signalSet(signal.map, movementX[1], ev.movementX * mouseSensitive);
    }
    const movementY = signal.mouse.movementY;
    if (movementY) {
      $__signalSet(signal.map, movementY[0], -ev.movementY * mouseSensitive);
      $__signalSet(signal.map, movementY[1], ev.movementY * mouseSensitive);
    }
    ev.preventDefault();
    signal.last = -1;
  });
}

const $__signalFrameBegin = (signal, time) => {
  {
    const timer = signal.timer;
    $__signalSet(signal.map, timer.time, time / 1000);
  }
  {
    const gps = navigator.getGamepads();
    for (let i = 0; i < gps.length; ++i) {
      if ($__gamepadTouched(gps[i])) {
        signal.last = i;
        break;
      }
    }

    const gp = gps[signal.last];
    if (gp) {
      const gamepad = signal.gamepad;
      for (let i = 0; i < gp.buttons.length; ++i) {
        const key = gamepad.buttons[i];
        if (!key) {
          continue;
        }
        $__signalSet(signal.map, key, gp.buttons[i].value);
      }
      for (let i = 0; i < gp.axes.length; ++i) {
        const key = gamepad.axes[i];
        if (!key) {
          continue;
        }
        const value = Math.trunc(gp.axes[i] * 4) / 4;
        $__signalSet(signal.map, key[0], -value);
        $__signalSet(signal.map, key[1], value);
      }
    }
  }
};

const $__signalFrameEnd = (signal) => {
  for (const key in signal.map) {
    $__signalHistory(signal.map, key);
    $__signalSet(signal.map, key, 0);
  }
};
