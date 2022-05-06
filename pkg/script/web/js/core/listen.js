
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
    $listen.timer = {
        prevTime: performance.now(),
        deltaTime: 0,
    };
    $listen.gamepad = {
        index: null,
        lx: 0,
        ly: 0,
        rx: 0,
        ry: 0,
        b0: false,
        b1: false,
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
    };
    $listen.click = [];
    $listen.touch = new Map();

    // deprecated
    $listen.input = {
        moveX: 0,
        moveY: 0,
        cameraX: 0,
        cameraY: 0,
    };

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
        const touch = $listen.touch.get(ev.pointerId);
        if(touch) {
            if(performance.now() - touch.time < 250) {
                LOGGING && console.log("click: [" + touch.x + "," + touch.y + "]");
                $listen.click.push({
                    x: touch.x,
                    y: touch.y,
                });
            }
        }
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
        default: return false;
    }
    return true;
};

const listen_tick_timer = (timer) => {  
    const time = performance.now();
    timer.deltaTime = (time - timer.prevTime) / 1000;
    timer.prevTime = time;
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
        gamepad.lt = (gp.buttons[6].value >= 0.5);
        gamepad.rt = (gp.buttons[7].value >= 0.5);
        const gamepadChanged =
            (gamepad.lx || gamepad.ly || gamepad.rx || gamepad.ry ||
             gamepad.b0 || gamepad.b1 || gamepad.lt || gamepad.rt) ? true : false;
        if(gamepadChanged) {
            $listen.mode = GAMEPAD_MODE_GAMEPAD;
        }
    }
}

// deprecated
const listen_tick_input = (input) => {
    const mode = $listen.mode;
    if(mode === GAMEPAD_MODE_GAMEPAD) {
        const gamepad = $listen.gamepad;
        input.moveX = gamepad.lx;
        input.moveY = -gamepad.ly;
        input.cameraX = gamepad.rx;
        input.cameraY = -gamepad.ry;
    } else if(mode === GAMEPAD_MODE_KEYBOARD) {
        const keyboard = $listen.keyboard;
        input.moveX = keyboard.a ? -1 : keyboard.d ? +1 : 0;
        input.moveY = keyboard.w ? +1 : keyboard.s ? -1 : 0;
        input.cameraX = keyboard.right ? +1 : keyboard.left ? -1 : 0;
        input.cameraY = keyboard.up ? +1 : keyboard.down ? -1 : 0;
    } else if(mode === GAMEPAD_MODE_POINTER) {
        input.moveX = 0;
        input.moveY = 0;
        input.cameraX = 0;
        input.cameraY = 0;
        for(const touch of $listen.touch.values()) {
            if(touch.sx < window.innerWidth/2) {
                // screen left
                input.moveX = (touch.x - touch.sx);
                input.moveY = -(touch.y - touch.sy);
            } else {
                // screen right
                input.cameraX = (touch.x - touch.sx);
                input.cameraY = -(touch.y - touch.sy);
            }
        }
    } else {
        // reset
        input.moveX = 0;
        input.moveY = 0;
        input.cameraX = 0;
        input.cameraY = 0;
    }
    [input.moveX, input.moveY] = xy_normalize(input.moveX, input.moveY);
    [input.cameraX, input.cameraY] = xy_normalize(input.cameraX, input.cameraY);
};

const listen_tick = () => {
    listen_tick_timer($listen.timer);
    listen_tick_gamepad($listen.gamepad);
    listen_tick_input($listen.input);
};

const listen_flush = () => {
    $listen.click.length = 0;
};
