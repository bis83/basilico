
const $__hidMapInit = (m, key) => {
  if (!m[key]) {
    m[key] = {};
  }
};
const $__hidMapSet = (m, key, value) => {
  $__hidMapInit(m, key);

  value = value || 0;
  const it = m[key];
  if (it && !it.hold) {
    it.value = Math.max(0, value);
  }
};
const $__hidMapHold = (m, key, value, hold) => {
  $__hidMapInit(m, key);

  value = value || 0;
  hold = hold || false;
  const it = m[key];
  if (it) {
    it.value = Math.max(0, value);
    it.hold = hold;
  }
};
const $__hidMapHistory = (m, key) => {
  const it = m[key];
  if (it) {
    it.history = it.value;
  }
};

const $__hidMapGet = (m, key) => {
  const it = m[key];
  if (it) {
    return it.value;
  }
  return 0;
};
const $__hidMapDelta = (m, key) => {
  const it = m[key];
  if (it) {
    return it.value - it.history;
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
      $__hidMapHold(hid.map, hid.keyboard[key], 0, false);
    }
    for (const key of hid.mouse.button) {
      $__hidMapHold(hid.map, key, 0, false);
    }
  };
  const hidKeyboard = (ev, value, hold) => {
    if (!html_is_pointer_lock()) {
      return;
    }
    const key = hid.keyboard[ev.code];
    if (key) {
      $__hidMapHold(hid.map, key, value, hold);
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
      $__hidMapHold(hid.map, key, value, hold);
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
      $__hidMapSet(hid.map, movementX[0], -ev.movementX * mouseSensitive);
      $__hidMapSet(hid.map, movementX[1], ev.movementX * mouseSensitive);
    }
    const movementY = hid.mouse.movementY;
    if (movementY) {
      $__hidMapSet(hid.map, movementY[0], -ev.movementY * mouseSensitive);
      $__hidMapSet(hid.map, movementY[1], ev.movementY * mouseSensitive);
    }
    ev.preventDefault();
    hid.last = -1;
  });
}

const $__hidFrameBegin = (hid, time) => {
  $__hidMapSet(hid.map, hid.timer, time / 1000);
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
        $__hidMapSet(hid.map, key, gp.buttons[i].value);
      }
      for (let i = 0; i < gp.axes.length; ++i) {
        const key = gamepad.axes[i];
        if (!key) {
          continue;
        }
        const value = Math.trunc(gp.axes[i] * 4) / 4;
        $__hidMapSet(hid.map, key[0], -value);
        $__hidMapSet(hid.map, key[1], value);
      }
    }
  }
};

const $__hidFrameEnd = (hid) => {
  for (const key in hid.map) {
    $__hidMapHistory(hid.map, key);
    $__hidMapSet(hid.map, key, 0);
  }
};
