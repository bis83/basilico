
const GAMEPAD_MODE_POINTER = 0;
const GAMEPAD_MODE_GAMEPAD = 1;
const GAMEPAD_MODE_KEYBOARD = 2;

var $listen = null;

const listen = (target, key, func) => {
    target.addEventListener(key, func);
};

const listen_disable_user_select = () => {
    const body = document.body;
    body.style.userSelect = 'none';
    body.style.webkitUserSelect = 'none';
    body.style.msUserSelect = 'none';
    body.style.mozUserSelect = 'none';
};

const listen_disable_touch_action = () => {
    const body = document.body;
    body.style.touchAction = 'none';
};

const listen_init = () => {
    listen_disable_user_select();
    listen_disable_touch_action();

    $listen = {};
    $listen.mode = GAMEPAD_MODE_POINTER;
    $listen.gamepad = {
        index: null,
        lx: 0,
        ly: 0,
        rx: 0,
        ry: 0,
        b0: false,
        b1: false,
        b8: false,
        b9: false,
        lt: false,
        rt: false,
    };
    $listen.keyboard = {
        w: false,
        a: false,
        s: false,
        d: false,
        up: false,
        left: false,
        down: false,
        right: false,
        z: false,
        x: false,
        space: false,
        lctrl: false,
        esc: false,
    };
    $listen.touch = new Map();
    $listen.click = [];

    listen(window, "focus", (ev) => {
    });
    listen(window, "blur", (ev) => {
    });
    listen(window, "resize", (ev) => {
    });
    listen(window, "gamepadconnected", (ev) => {
        LOGGING && console.log("gamepadconnected: " + ev.gamepad.index);

        $listen.gamepad.index = ev.gamepad.index;
        $listen.mode = GAMEPAD_MODE_GAMEPAD;
    });
    listen(window, "gamepaddisconnected", (ev) => {
        LOGGING && console.log("gamepaddisconnected: " + ev.gamepad.index);

        if($listen.gamepad.index === ev.gamepad.index) {
            $listen.gamepad.index = null;
        }
    });
    listen(document, "keydown", (ev) => {
        if(listen_keyboard($listen.keyboard, ev.code, true)) {
            $listen.mode = GAMEPAD_MODE_KEYBOARD;
            ev.preventDefault();
        }
    });
    listen(document, "keyup", (ev) => {
        if(listen_keyboard($listen.keyboard, ev.code, false)) {
            $listen.mode = GAMEPAD_MODE_KEYBOARD;
            ev.preventDefault();
        }
    });
    listen(document.body, "contextmenu", (ev) => {
        ev.preventDefault();
    });
    listen(document.body, "pointerdown", (ev) => {
        $listen.touch.set(ev.pointerId, {
            x: ev.clientX,
            y: ev.clientY,
            sx: ev.clientX,
            sy: ev.clientY,
            time: performance.now(),
        });
        $listen.mode = GAMEPAD_MODE_POINTER;
    });
    listen(document.body, "pointerup", (ev) => {
        listen_click(ev.pointerId);
        $listen.touch.delete(ev.pointerId);
        $listen.mode = GAMEPAD_MODE_POINTER;
    });
    listen(document.body, "pointerout", (ev) => {
        $listen.touch.delete(ev.pointerId);
        $listen.mode = GAMEPAD_MODE_POINTER;
    });
    listen(document.body, "pointermove", (ev) => {
        const touch = $listen.touch.get(ev.pointerId);
        if(touch) {
            touch.x = ev.clientX;
            touch.y = ev.clientY;
            $listen.mode = GAMEPAD_MODE_POINTER;
        }
    });
};

const listen_keyboard = (keyboard, code, value) => {
    switch(code) {
        case "KeyW": keyboard.w = value; break;
        case "KeyA": keyboard.a = value; break;
        case "KeyS": keyboard.s = value; break;
        case "KeyD": keyboard.d = value; break;
        case "ArrowUp": keyboard.up = value; break;
        case "ArrowLeft": keyboard.left = value; break;
        case "ArrowDown": keyboard.down = value; break;
        case "ArrowRight": keyboard.right = value; break;
        case "KeyZ": keyboard.z = value; break;
        case "KeyX": keyboard.x = value; break;
        case "Space": keyboard.space = value; break;
        case "ControlLeft": keyboard.lctrl = value; break;
        case "Escape": keyboard.esc = value; break;
        default: return false;
    }
    return true;
};

const listen_click = (pointerId) => {
    const touch = $listen.touch.get(pointerId);
    if(touch) {
        if(performance.now() - touch.time < 250) {
            LOGGING && console.log("click: [" + touch.x + "," + touch.y + "]");
            $listen.click.push({
                x: touch.x,
                y: touch.y,
            });
        }
    }
};

const listen_tick_gamepad = (gamepad) => {
    if(gamepad.index !== null) {
        const gamepads = navigator.getGamepads();
        const gp = gamepads[gamepad.index];
        gamepad.lx = Math.trunc(gp.axes[0] * 4) / 4;
        gamepad.ly = Math.trunc(gp.axes[1] * 4) / 4;
        gamepad.rx = Math.trunc(gp.axes[2] * 4) / 4;
        gamepad.ry = Math.trunc(gp.axes[3] * 4) / 4;
        gamepad.b0 = (gp.buttons[0].value >= 0.5);
        gamepad.b1 = (gp.buttons[1].value >= 0.5);
        gamepad.b8 = (gp.buttons[8].value >= 0.5);
        gamepad.b9 = (gp.buttons[9].value >= 0.5);
        gamepad.lt = (gp.buttons[6].value >= 0.5);
        gamepad.rt = (gp.buttons[7].value >= 0.5);
        const gamepadChanged =
            (gamepad.lx || gamepad.ly || gamepad.rx || gamepad.ry ||
             gamepad.b0 || gamepad.b1 || gamepad.b8 || gamepad.b9 || gamepad.lt || gamepad.rt) ? true : false;
        if(gamepadChanged) {
            $listen.mode = GAMEPAD_MODE_GAMEPAD;
        }
    }
}

const listen_tick = () => {
    listen_tick_gamepad($listen.gamepad);
};

const listen_flush = () => {
    $listen.click.length = 0;
};
