
const $__funcInit = (func) => {
  func.timer.t = performance.now();

  const keymap = {
    "KeyW": "w",
    "KeyA": "a",
    "KeyS": "s",
    "KeyD": "d",
    "ArrowUp": "up",
    "ArrowLeft": "left",
    "ArrowDown": "down",
    "ArrowRight": "right",
    "KeyQ": "q",
    "KeyE": "e",
    "KeyZ": "z",
    "KeyX": "x",
    "Space": "space",
    "ControlLeft": "lctrl",
    "Escape": "esc",
  };
  const buttonmap = {
    0: "b0",
    1: "b1",
    2: "b2",
    3: "b3",
    4: "b4",
  };

  html_listen(window, "focus", (ev) => {
  });
  html_listen(window, "blur", (ev) => {
    const mkey = func.mkey;
    for (const key in keymap) {
      mkey[keymap[key]] = false;
    }
    for (const btn in buttonmap) {
      mkey[buttonmap[btn]] = false;
    }
    mkey.mx = 0;
    mkey.my = 0;
  });
  html_listen(window, "resize", (ev) => {
  });
  html_listen(window, "gamepadconnected", (ev) => {
    func.gpad.id = ev.gamepad.index;
  });
  html_listen(window, "gamepaddisconnected", (ev) => {
    if (func.gpad.id === ev.gamepad.index) {
      func.gpad.id = null;
    }
  });
  html_listen(document, "keydown", (ev) => {
    if (html_is_pointer_lock()) {
      const key = keymap[ev.code];
      if (key) {
        func.mkey[key] = true;
        ev.preventDefault();
      }
    }
  });
  html_listen(document, "keyup", (ev) => {
    if (html_is_pointer_lock()) {
      const key = keymap[ev.code];
      if (key) {
        func.mkey[key] = false;
        ev.preventDefault();
      }
    }
  });
  html_listen(document, "click", (ev) => {
    if (!html_is_pointer_lock()) {
      html_pointer_lock();
    }
  });
  html_listen(document, "mousedown", (ev) => {
    if (html_is_pointer_lock()) {
      const btn = buttonmap[ev.button];
      if (btn) {
        func.mkey[btn] = true;
        ev.preventDefault();
      }
    }
  });
  html_listen(document, "mouseup", (ev) => {
    if (html_is_pointer_lock()) {
      const btn = buttonmap[ev.button];
      if (btn) {
        func.mkey[btn] = false;
        ev.preventDefault();
      }
    }
  });
  html_listen(document, "mousemove", (ev) => {
    if (html_is_pointer_lock()) {
      func.mkey.mx = ev.movementX;
      func.mkey.my = ev.movementY;
      ev.preventDefault();
    }
  });
  html_listen(document.body, "contextmenu", (ev) => {
    ev.preventDefault();
  });
}

const $__funcFrameBegin = (func, time) => {
  {
    const timer = func.timer;
    timer.dt = (time - timer.t) / 1000;
    timer.t = time;
    timer.n += 1;
  }
  {
    const gpad = func.gpad;
    if (gpad.id !== null) {
      const gp = navigator.getGamepads()[gpad.id];
      gpad.lx = Math.trunc(gp.axes[0] * 4) / 4;
      gpad.ly = Math.trunc(gp.axes[1] * 4) / 4;
      gpad.rx = Math.trunc(gp.axes[2] * 4) / 4;
      gpad.ry = Math.trunc(gp.axes[3] * 4) / 4;
      gpad.b0 = (gp.buttons[0].value >= 0.5);
      gpad.b1 = (gp.buttons[1].value >= 0.5);
      gpad.b8 = (gp.buttons[8].value >= 0.5);
      gpad.b9 = (gp.buttons[9].value >= 0.5);
      gpad.lb = (gp.buttons[4].value >= 0.5);
      gpad.rb = (gp.buttons[5].value >= 0.5);
      gpad.lt = (gp.buttons[6].value >= 0.5);
      gpad.rt = (gp.buttons[7].value >= 0.5);
    }
  }
};

const $__funcFrameEnd = (func) => {
  {
    const mkey = func.mkey;
    mkey.mx = 0;
    mkey.my = 0;
  }
};

const $deltaTime = (app) => {
  return app.func.timer.dt;
};

const $event = (app, shortcut_mkey, shortcut_gpad) => {
  const func = app.func;
  if (shortcut_mkey) {
    const mkey = func.mkey;
    if (shortcut_mkey === "wasd") {
      const x = mkey.a ? -1 : mkey.d ? +1 : 0;
      const y = mkey.w ? +1 : mkey.s ? -1 : 0;
      if (x !== 0 || y !== 0) {
        return xy_normalize(x, y);
      }
    } else if (shortcut_mkey === "arrow") {
      const x = mkey.right ? +1 : mkey.left ? -1 : 0;
      const y = mkey.up ? +1 : mkey.down ? -1 : 0;
      if (x !== 0 || y !== 0) {
        return xy_normalize(x, y);
      }
    } else if (shortcut_mkey === "mouse") {
      const x = mkey.mx;
      const y = -mkey.my;
      if (x !== 0 || y !== 0) {
        return xy_normalize(x, y);
      }
    } else {
      if (mkey[shortcut_mkey]) {
        return [1, 0];
      }
    }
  }
  if (shortcut_gpad) {
    const gpad = func.gpad;
    if (shortcut_gpad === "ls") {
      return xy_normalize(gpad.lx, -gpad.ly);
    } else if (shortcut_gpad === "rs") {
      return xy_normalize(gpad.rx, -gpad.ry);
    } else {
      if (gpad[shortcut_gpad]) {
        return [1, 0];
      }
    }
  }
  return null;
};
