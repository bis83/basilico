
const $__listenInit = (listen) => {
  listen.timer = {
    t: performance.now(),
    dt: 0,
    n: 0,
  };
  listen.gpad = {
    id: null,
    lx: 0,
    ly: 0,
    rx: 0,
    ry: 0,
    b0: false,
    b1: false,
    b8: false,
    b9: false,
    lb: false,
    rb: false,
    lt: false,
    rt: false,
  };
  listen.mkey = {
    mx: 0,
    my: 0,
    b0: false,
    b1: false,
    b2: false,
    b3: false,
    b4: false,
    w: false,
    a: false,
    s: false,
    d: false,
    up: false,
    left: false,
    down: false,
    right: false,
    q: false,
    e: false,
    z: false,
    x: false,
    space: false,
    lctrl: false,
    esc: false,
  };

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
    const mkey = listen.mkey;
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
    listen.gpad.id = ev.gamepad.index;
  });
  html_listen(window, "gamepaddisconnected", (ev) => {
    if (listen.gpad.id === ev.gamepad.index) {
      listen.gpad.id = null;
    }
  });
  html_listen(document, "keydown", (ev) => {
    const key = keymap[ev.code];
    if (key) {
      listen.mkey[key] = true;
      ev.preventDefault();
    }
  });
  html_listen(document, "keyup", (ev) => {
    const key = keymap[ev.code];
    if (key) {
      listen.mkey[key] = false;
      ev.preventDefault();
    }
  });
  html_listen(document, "click", (ev) => {
    if (!document.pointerLockElement) {
      const canvas = html_canvas();
      canvas.requestPointerLock();
    }
  });
  html_listen(document, "mousedown", (ev) => {
    if (document.pointerLockElement === html_canvas()) {
      const btn = buttonmap[ev.button];
      if (btn) {
        listen.mkey[btn] = true;
        ev.preventDefault();
      }
    }
  });
  html_listen(document, "mouseup", (ev) => {
    if (document.pointerLockElement === html_canvas()) {
      const btn = buttonmap[ev.button];
      if (btn) {
        listen.mkey[btn] = false;
        ev.preventDefault();
      }
    }
  });
  html_listen(document, "mousemove", (ev) => {
    if (document.pointerLockElement === html_canvas()) {
      listen.mkey.mx = ev.movementX;
      listen.mkey.my = ev.movementY;
      ev.preventDefault();
    }
  });
  html_listen(document.body, "contextmenu", (ev) => {
    ev.preventDefault();
  });
}

const $__listenFrameBegin = (listen, time) => {
  listen.timer.dt = (time - listen.timer.t) / 1000;
  listen.timer.t = time;
  listen.timer.n += 1;

  if (listen.gpad.id !== null) {
    const gp = navigator.getGamepads()[listen.gpad.id];
    listen.gpad.lx = Math.trunc(gp.axes[0] * 4) / 4;
    listen.gpad.ly = Math.trunc(gp.axes[1] * 4) / 4;
    listen.gpad.rx = Math.trunc(gp.axes[2] * 4) / 4;
    listen.gpad.ry = Math.trunc(gp.axes[3] * 4) / 4;
    listen.gpad.b0 = (gp.buttons[0].value >= 0.5);
    listen.gpad.b1 = (gp.buttons[1].value >= 0.5);
    listen.gpad.b8 = (gp.buttons[8].value >= 0.5);
    listen.gpad.b9 = (gp.buttons[9].value >= 0.5);
    listen.gpad.lb = (gp.buttons[4].value >= 0.5);
    listen.gpad.rb = (gp.buttons[5].value >= 0.5);
    listen.gpad.lt = (gp.buttons[6].value >= 0.5);
    listen.gpad.rt = (gp.buttons[7].value >= 0.5);
  }
};

const $__listenFrameEnd = (listen) => {
  listen.mkey.mx = 0;
  listen.mkey.my = 0;
};

const $listenDeltaTime = (listen) => {
  return listen.timer.dt;
};

const $listenGet = (listen, shortcut_mkey, shortcut_gpad) => {
  if (shortcut_mkey) {
    const mkey = listen.mkey;
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
      return xy_normalize(mkey.mx, -mkey.my);
    } else {
      if (mkey[shortcut_mkey]) {
        return [1, 0];
      }
    }
  }
  if (shortcut_gpad) {
    const gpad = listen.gpad;
    if (shortcut_gpad === "ls") {
      return xy_normalize(gpad.lx, -gpad.ly);
    } else if (shortcut_gpad === "rs") {
      return xy_normalize(gpad.rx, -gpad.ry);
    } else {
      if (listen.gpad[shortcut_gpad]) {
        return [1, 0];
      }
    }
  }
  return null;
};
