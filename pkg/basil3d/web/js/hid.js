
const $__hidSet = (hid, key, value) => {
  value = value || 0;
  const sig = hid[key];
  if (sig && !sig.hold) {
    sig.value = Math.max(0, value);
  }
};
const $__hidHold = (hid, key, value, hold) => {
  value = value || 0;
  hold = hold || false;
  const sig = hid[key];
  if (sig) {
    sig.value = Math.max(0, value);
    sig.hold = hold;
  }
};
const $__hidGet = (hid, key) => {
  const sig = hid[key];
  if (sig) {
    return sig.value;
  }
  return 0;
};

const $__hidHistory = (hid, key) => {
  const sig = hid[key];
  if (sig) {
    sig.history = sig.value;
  }
};
const $__hidAddDelta = (hid, key, value) => {
  value = value || 0;
  const sig = hid[key];
  if (sig && !sig.hold) {
    sig.value = Math.max(0, sig.history + value);
  }
};
const $__hidDelta = (hid, key) => {
  const sig = hid[key];
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

const $__hidInit = (hid) => {

  const hidReset = () => {
    for (const key in hid.keyboard) {
      $__hidHold(hid.map, hid.keyboard[key], 0, false);
    }
    for (const key of hid.mouse.button) {
      $__hidHold(hid.map, key, 0, false);
    }
  };
  const hidKeyboard = (ev, value, hold) => {
    if (!html_is_pointer_lock()) {
      return;
    }
    const key = hid.keyboard[ev.code];
    if (key) {
      $__hidHold(hid.map, key, value, hold);
      ev.preventDefault();
      hid.last = -1;
    }
  };
  const hidMouse = (ev, value, hold) => {
    if (!html_is_pointer_lock()) {
      return;
    }
    const key = hid.mouse.button[ev.button];
    if (key) {
      $__hidHold(hid.map, key, value, hold);
      ev.preventDefault();
      hid.last = -1;
    }
  };

  html_listen(document.body, "contextmenu", (ev) => {
    ev.preventDefault();
  });
  html_listen(window, "blur", (ev) => {
    hidReset();
  });
  html_listen(document, "click", (ev) => {
    if (!html_is_pointer_lock()) {
      html_pointer_lock();
      hidReset();
    }
  });
  html_listen(document, "keydown", (ev) => {
    hidKeyboard(ev, 1, true);
  });
  html_listen(document, "keyup", (ev) => {
    hidKeyboard(ev, 0, false);
  });
  html_listen(document, "mousedown", (ev) => {
    hidMouse(ev, 1, true);
  });
  html_listen(document, "mouseup", (ev) => {
    hidMouse(ev, 0, false);
  });
  html_listen(document, "mousemove", (ev) => {
    if (!html_is_pointer_lock()) {
      return;
    }
    const mouseSensitive = 0.25;
    const movementX = hid.mouse.movementX;
    if (movementX) {
      $__hidSet(hid.map, movementX[0], -ev.movementX * mouseSensitive);
      $__hidSet(hid.map, movementX[1], ev.movementX * mouseSensitive);
    }
    const movementY = hid.mouse.movementY;
    if (movementY) {
      $__hidSet(hid.map, movementY[0], -ev.movementY * mouseSensitive);
      $__hidSet(hid.map, movementY[1], ev.movementY * mouseSensitive);
    }
    ev.preventDefault();
    hid.last = -1;
  });
}

const $__hidFrameBegin = (hid, time) => {
  $__hidSet(hid.map, hid.timer, time / 1000);
  {
    const gps = navigator.getGamepads();
    for (let i = 0; i < gps.length; ++i) {
      if ($__gamepadTouched(gps[i])) {
        hid.last = i;
        break;
      }
    }

    const gp = gps[hid.last];
    if (gp) {
      const gamepad = hid.gamepad;
      for (let i = 0; i < gp.buttons.length; ++i) {
        const key = gamepad.buttons[i];
        if (!key) {
          continue;
        }
        $__hidSet(hid.map, key, gp.buttons[i].value);
      }
      for (let i = 0; i < gp.axes.length; ++i) {
        const key = gamepad.axes[i];
        if (!key) {
          continue;
        }
        const value = Math.trunc(gp.axes[i] * 4) / 4;
        $__hidSet(hid.map, key[0], -value);
        $__hidSet(hid.map, key[1], value);
      }
    }
  }
};

const $__hidFrameEnd = (hid) => {
  for (const key in hid.map) {
    $__hidHistory(hid.map, key);
    $__hidSet(hid.map, key, 0);
  }
};
