
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

const $__funcInit = (func) => {
  $__signalHold(func.signal, func.timer.time, performance.now(), true);

  html_listen(document.body, "contextmenu", (ev) => {
    ev.preventDefault();
  });

  html_listen(window, "gamepadconnected", (ev) => {
    const gamepad = func.gamepad;
    gamepad.id = ev.gamepad.index;
  });
  html_listen(window, "gamepaddisconnected", (ev) => {
    const gamepad = func.gamepad;
    if (gamepad.id === ev.gamepad.index) {
      gamepad.id = null;
    }
  });

  const signalReset = () => {
    for (const key in func.keyboard) {
      $__signalHold(func.signal, func.keyboard[key], 0, false);
    }
    for (const key of func.mouse.button) {
      $__signalHold(func.signal, key, 0, false);
    }
  };
  const signalKeyboard = (ev, value, hold) => {
    if (!html_is_pointer_lock()) {
      return;
    }
    const key = func.keyboard[ev.code];
    if (key) {
      $__signalHold(func.signal, key, value, hold);
      ev.preventDefault();
    }
  };
  const signalMouse = (ev, value, hold) => {
    if (!html_is_pointer_lock()) {
      return;
    }
    const key = func.mouse.button[ev.button];
    if (key) {
      $__signalHold(func.signal, key, value, hold);
      ev.preventDefault();
    }
  };

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
    const movementX = func.mouse.movementX;
    if (movementX) {
      $__signalSet(func.signal, movementX[0], -ev.movementX * mouseSensitive);
      $__signalSet(func.signal, movementX[1], ev.movementX * mouseSensitive);
    }
    const movementY = func.mouse.movementY;
    if (movementY) {
      $__signalSet(func.signal, movementY[0], -ev.movementY * mouseSensitive);
      $__signalSet(func.signal, movementY[1], ev.movementY * mouseSensitive);
    }
    ev.preventDefault();
  });
  html_listen(window, "blur", (ev) => {
    signalReset();
  });
}

const $__funcFrameBegin = (func, time) => {
  {
    const timer = func.timer;
    const prevTime = $__signalGet(func.signal, timer.time);
    const frameCount = $__signalGet(func.signal, timer.frameCount);
    const dt = (time - prevTime) / 1000;
    $__signalHold(func.signal, timer.time, time, true);
    $__signalHold(func.signal, timer.deltaTime, dt, true);
    $__signalHold(func.signal, timer.frameCount, frameCount + 1, true);
  }
  if (!html_is_pointer_lock()) {
    const gamepad = func.gamepad;
    if (gamepad.id !== null) {
      const gp = navigator.getGamepads()[gamepad.id];
      for (let i = 0; i < gp.buttons.length; ++i) {
        const key = gamepad.buttons[i];
        if (!key) {
          continue;
        }
        $__signalSet(func.signal, key, gp.buttons[i].value);
      }
      for (let i = 0; i < gp.axes.length; ++i) {
        const key = gamepad.axes[i];
        if (!key) {
          continue;
        }
        const value = Math.trunc(gp.axes[i] * 4) / 4;
        $__signalSet(func.signal, key[0], -value);
        $__signalSet(func.signal, key[1], value);
      }
    }
  }
};

const $__funcFrameEnd = (func) => {
  for (const key in func.signal) {
    $__signalSet(func.signal, key, 0);
  }
};

const $signal = (app, signal) => {
  return $__signalGet(app.func.signal, signal);
};
