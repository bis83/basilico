
const $__listenInit = (listen) => {
  listen.timer = {
    t: performance.now(),
    dt: 0,
    n: 0,
  };
  listen.gamepad = {
    index: null,
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
  listen.keyboard = {
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
  listen.touch = new Map();

  const keymap = (keyboard, code, value) => {
    switch (code) {
      case "KeyW": keyboard.w = value; break;
      case "KeyA": keyboard.a = value; break;
      case "KeyS": keyboard.s = value; break;
      case "KeyD": keyboard.d = value; break;
      case "ArrowUp": keyboard.up = value; break;
      case "ArrowLeft": keyboard.left = value; break;
      case "ArrowDown": keyboard.down = value; break;
      case "ArrowRight": keyboard.right = value; break;
      case "KeyQ": keyboard.q = value; break;
      case "KeyE": keyboard.e = value; break;
      case "KeyZ": keyboard.z = value; break;
      case "KeyX": keyboard.x = value; break;
      case "Space": keyboard.space = value; break;
      case "ControlLeft": keyboard.lctrl = value; break;
      case "Escape": keyboard.esc = value; break;
      default: return false;
    }
    return true;
  };

  html_listen(window, "focus", (ev) => {
  });
  html_listen(window, "blur", (ev) => {
    for (const key in listen.keyboard) {
      listen.keyboard[key] = false;
    }
  });
  html_listen(window, "resize", (ev) => {
  });
  html_listen(window, "gamepadconnected", (ev) => {
    listen.gamepad.index = ev.gamepad.index;
  });
  html_listen(window, "gamepaddisconnected", (ev) => {
    if (listen.gamepad.index === ev.gamepad.index) {
      listen.gamepad.index = null;
    }
  });
  html_listen(document, "keydown", (ev) => {
    if (keymap(listen.keyboard, ev.code, true)) {
      ev.preventDefault();
    }
  });
  html_listen(document, "keyup", (ev) => {
    if (keymap(listen.keyboard, ev.code, false)) {
      ev.preventDefault();
    }
  });
  html_listen(document.body, "contextmenu", (ev) => {
    ev.preventDefault();
  });
  html_listen(document.body, "pointerdown", (ev) => {
    listen.touch.set(ev.pointerId, {
      x: ev.clientX,
      y: ev.clientY,
      sx: ev.clientX,
      sy: ev.clientY,
      time: performance.now(),
    });
  });
  html_listen(document.body, "pointerup", (ev) => {
    listen.touch.delete(ev.pointerId);
  });
  html_listen(document.body, "pointerout", (ev) => {
    listen.touch.delete(ev.pointerId);
  });
  html_listen(document.body, "pointermove", (ev) => {
    const touch = listen.touch.get(ev.pointerId);
    if (touch) {
      touch.x = ev.clientX;
      touch.y = ev.clientY;
    }
  });
}

const $__listenTick = (listen, time) => {
  listen.timer.dt = (time - listen.timer.t) / 1000;
  listen.timer.t = time;
  listen.timer.n += 1;

  if (listen.gamepad.index !== null) {
    const gamepads = navigator.getGamepads();
    const gp = gamepads[listen.gamepad.index];
    listen.gamepad.lx = Math.trunc(gp.axes[0] * 4) / 4;
    listen.gamepad.ly = Math.trunc(gp.axes[1] * 4) / 4;
    listen.gamepad.rx = Math.trunc(gp.axes[2] * 4) / 4;
    listen.gamepad.ry = Math.trunc(gp.axes[3] * 4) / 4;
    listen.gamepad.b0 = (gp.buttons[0].value >= 0.5);
    listen.gamepad.b1 = (gp.buttons[1].value >= 0.5);
    listen.gamepad.b8 = (gp.buttons[8].value >= 0.5);
    listen.gamepad.b9 = (gp.buttons[9].value >= 0.5);
    listen.gamepad.lb = (gp.buttons[4].value >= 0.5);
    listen.gamepad.rb = (gp.buttons[5].value >= 0.5);
    listen.gamepad.lt = (gp.buttons[6].value >= 0.5);
    listen.gamepad.rt = (gp.buttons[7].value >= 0.5);
  }
};

const $listenDeltaTime = (listen) => {
  return listen.timer.dt;
};

const $listenGet = (listen, shortcut_key, shortcut_gamepad, touch_rect) => {
  if (touch_rect) {
    for (const touch of listen.touch.values()) {
      if (xy_hit_rect([touch.sx, touch.sy], ...touch_rect)) {
        const x = (touch.x - touch.sx);
        const y = -(touch.y - touch.sy);
        return xy_normalize(x, y);
      }
    }
  }
  if (shortcut_key) {
    if (shortcut_key === "wasd") {
      const keyboard = listen.keyboard;
      const x = keyboard.a ? -1 : keyboard.d ? +1 : 0;
      const y = keyboard.w ? +1 : keyboard.s ? -1 : 0;
      if (x !== 0 || y !== 0) {
        return xy_normalize(x, y);
      }
    } else if (shortcut_key === "arrow") {
      const keyboard = listen.keyboard;
      const x = keyboard.right ? +1 : keyboard.left ? -1 : 0;
      const y = keyboard.up ? +1 : keyboard.down ? -1 : 0;
      if (x !== 0 || y !== 0) {
        return xy_normalize(x, y);
      }
    } else {
      if (listen.keyboard[shortcut_key]) {
        return [1, 0];
      }
    }
  }
  if (shortcut_gamepad) {
    if (shortcut_gamepad === "left-stick") {
      const gamepad = listen.gamepad;
      return xy_normalize(gamepad.lx, -gamepad.ly);
    } else if (shortcut_gamepad === "right-stick") {
      const gamepad = listen.gamepad;
      return xy_normalize(gamepad.rx, -gamepad.ry);
    } else {
      if (listen.gamepad[shortcut_gamepad]) {
        return [1, 0];
      }
    }
  }
  return null;
};
