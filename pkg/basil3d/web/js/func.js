
const $__funcInit = (func) => {
  func.timer.t = performance.now();

  html_listen(document.body, "contextmenu", (ev) => {
    ev.preventDefault();
  });

  html_listen(window, "gamepadconnected", (ev) => {
    const gpad = func.gpad;
    gpad.id = ev.gamepad.index;
  });
  html_listen(window, "gamepaddisconnected", (ev) => {
    const gpad = func.gpad;
    if (gpad.id === ev.gamepad.index) {
      gpad.id = null;
    }
  });

  const mkeyreset = () => {
    const mkey = func.mkey;
    for (const k in func.keymap) {
      mkey[func.keymap[k]] = false;
    }
    for (const btn of func.btnmap) {
      mkey[btn] = false;
    }
    mkey.mx = 0;
    mkey.my = 0;
  };
  const keyevent = (ev, value) => {
    if (html_is_pointer_lock()) {
      const key = func.keymap[ev.code];
      if (key) {
        func.mkey[key] = value;
        ev.preventDefault();
      }
    }
  };
  const mouseevent = (ev, value) => {
    if (html_is_pointer_lock()) {
      const btn = func.btnmap[ev.button];
      if (btn) {
        func.mkey[btn] = value;
        ev.preventDefault();
      }
    }
  };
  html_listen(document, "click", (ev) => {
    if (!html_is_pointer_lock()) {
      html_pointer_lock();
      mkeyreset();
    }
  });
  html_listen(document, "keydown", (ev) => {
    keyevent(ev, true);
  });
  html_listen(document, "keyup", (ev) => {
    keyevent(ev, false);
  });
  html_listen(document, "mousedown", (ev) => {
    mouseevent(ev, true);
  });
  html_listen(document, "mouseup", (ev) => {
    mouseevent(ev, false);
  });
  html_listen(document, "mousemove", (ev) => {
    if (html_is_pointer_lock()) {
      const mkey = func.mkey;
      mkey.mx = ev.movementX;
      mkey.my = ev.movementY;
      ev.preventDefault();
    }
  });
  html_listen(window, "blur", (ev) => {
    mkeyreset();
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
  if (html_is_pointer_lock() && shortcut_mkey) {
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
