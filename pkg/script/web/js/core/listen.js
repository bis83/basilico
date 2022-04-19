
const GAMEPAD_MODE_GAMEPAD = 0;
const GAMEPAD_MODE_MOUSE_KEYBOARD = 1;
const GAMEPAD_MODE_VIRTUAL_TOUCH = 2;

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

const listen_init = () => {
    listen_disable_user_select();

    $listen = {};
    $listen.timer = {
        prevTime: performance.now(),
        deltaTime: 0,
    };
    $listen.input = {
        mode: GAMEPAD_MODE_GAMEPAD,
        moveX: 0,
        moveY: 0,
        cameraX: 0,
        cameraY: 0,
        act: false,
        sub: false,
        actButton: false,
        subButton: false,
    };
    $listen.input.gamepad = {
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
    $listen.input.keyboard = {
        w: false,
        a: false,
        s: false,
        d: false,
        up: false,
        left: false,
        down: false,
        right: false,
        space: false,
        lctrl: false,
    };
    $listen.input.mouse = {
        x: 0,
        y: 0,
        mx: 0,
        my: 0,
        lb: false,
        rb: false,
        mb: false,
    };
    $listen.input.touch = new Map();

    listen(window, "focus", (ev) => {
    });
    listen(window, "blur", (ev) => {
    });
    listen(window, "resize", (ev) => {
    });
    listen(window, "gamepadconnected", (ev) => {
        LOGGING && console.log("gamepadconnected: " + ev.gamepad.index);

        $listen.input.gamepad.index = ev.gamepad.index;
        $listen.input.mode = GAMEPAD_MODE_GAMEPAD;
    });
    listen(window, "gamepaddisconnected", (ev) => {
        LOGGING && console.log("gamepaddisconnected: " + ev.gamepad.index);

        if($listen.input.gamepad.index === ev.gamepad.index) {
            $listen.input.gamepad.index = null;
        }
    });
    listen(document, "keydown", (ev) => {
        if(listen_keyboard($listen.input.keyboard, ev.code, true)) {
            $listen.input.mode = GAMEPAD_MODE_MOUSE_KEYBOARD;
            ev.preventDefault();
        }
    });
    listen(document, "keyup", (ev) => {
        if(listen_keyboard($listen.input.keyboard, ev.code, false)) {
            $listen.input.mode = GAMEPAD_MODE_MOUSE_KEYBOARD;
            ev.preventDefault();
        }
    });
    listen(document.body, "contextmenu", (ev) => {
        ev.preventDefault();
    });
    listen(document.body, "mousedown", (ev) => {
        if(listen_mouse($listen.input.mouse, ev)) {
            $listen.input.mode = GAMEPAD_MODE_MOUSE_KEYBOARD;
            ev.preventDefault();        
        }
    });
    listen(document.body, "mouseup", (ev) => {
        if(listen_mouse($listen.input.mouse, ev)) {
            $listen.input.mode = GAMEPAD_MODE_MOUSE_KEYBOARD;
            ev.preventDefault();        
        }
    });
    listen(document.body, "mousemove", (ev) => {
        if(listen_mouse($listen.input.mouse, ev)) {
            $listen.input.mode = GAMEPAD_MODE_MOUSE_KEYBOARD;
            ev.preventDefault();        
        }
    });
    listen(document.body, "touchstart", (ev) => {
        for(const t of ev.changedTouches) {
            $listen.input.touch.set(t.identifier, {
                x: t.clientX,
                y: t.clientY,
                sx: t.clientX,
                sy: t.clientY
            });
        }
        $listen.input.mode = GAMEPAD_MODE_VIRTUAL_TOUCH;
    });
    listen(document.body, "touchend", (ev) => {
        for(const t of ev.changedTouches) {
            $listen.input.touch.delete(t.identifier);
        }
        $listen.input.mode = GAMEPAD_MODE_VIRTUAL_TOUCH;
    });
    listen(document.body, "touchcancel", (ev) => {
        for(const t of ev.changedTouches) {
            $listen.input.touch.delete(t.identifier);
        }
        $listen.input.mode = GAMEPAD_MODE_VIRTUAL_TOUCH;
    });
    listen(document.body, "touchmove", (ev) => {
        for(const t of ev.changedTouches) {
            const touch = $listen.input.touch.get(t.identifier);
            if(touch) {
                touch.x = t.clientX;
                touch.y = t.clientY;
            }
        }
        $listen.input.mode = GAMEPAD_MODE_VIRTUAL_TOUCH;
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
        case "Space": keyboard.space = value; break;
        case "ControlLeft": keyboard.lctrl = value; break;
        default: return false;
    }
    return true;
};

const listen_mouse = (mouse, ev) => {
    mouse.mx += ev.movementX || 0;
    mouse.my += ev.movementY || 0;
    mouse.x = ev.x;
    mouse.y = ev.y;
    mouse.lb = (ev.buttons & 1) !== 0;
    mouse.rb = (ev.buttons & 2) !== 0;
    mouse.mb = (ev.buttons & 4) !== 0;
    return true;
};

const listen_tick_timer = (timer) => {  
    const time = performance.now();
    timer.deltaTime = (time - timer.prevTime) / 1000;
    timer.prevTime = time;
};

const listen_tick_gamepad = (input) => {
    if(input.gamepad.index !== null) {
        const gamepads = navigator.getGamepads();
        const gp = gamepads[input.gamepad.index];
        input.gamepad.lx = Math.trunc(gp.axes[0] * 4) / 4;
        input.gamepad.ly = Math.trunc(gp.axes[1] * 4) / 4;
        input.gamepad.rx = Math.trunc(gp.axes[2] * 4) / 4;
        input.gamepad.ry = Math.trunc(gp.axes[3] * 4) / 4;
        input.gamepad.b0 = (gp.buttons[0].value >= 0.5);
        input.gamepad.b1 = (gp.buttons[1].value >= 0.5);
        input.gamepad.lt = (gp.buttons[6].value >= 0.5);
        input.gamepad.rt = (gp.buttons[7].value >= 0.5);
        const gamepadChanged =
            (input.gamepad.lx || input.gamepad.ly || input.gamepad.rx || input.gamepad.ry ||
             input.gamepad.b0 || input.gamepad.b1 || input.gamepad.lt || input.gamepad.rt) ? true : false;
        if(gamepadChanged) {
            input.mode = GAMEPAD_MODE_GAMEPAD;
        }
    }
}

const listen_tick_input = (input) => {
    const mode = input.mode;
    if(mode === GAMEPAD_MODE_GAMEPAD) {
        input.moveX = input.gamepad.lx;
        input.moveY = -input.gamepad.ly;
        input.cameraX = -input.gamepad.rx;
        input.cameraY = -input.gamepad.ry;
        input.act = (!input.actButton && input.gamepad.b0);
        input.sub = (!input.subButton && input.gamepad.b1);
        input.actButton = input.gamepad.b0;
        input.subButton = input.gamepad.b1;
    } else if(mode === GAMEPAD_MODE_MOUSE_KEYBOARD) {
        input.moveX = input.keyboard.a ? -1 : input.keyboard.d ? +1 : 0;
        input.moveY = input.keyboard.w ? +1 : input.keyboard.s ? -1 : 0;
        input.cameraX = input.keyboard.right ? -1 : input.keyboard.left ? +1 : 0;
        input.cameraY = input.keyboard.up ? +1 : input.keyboard.down ? -1 : 0;
        if(input.mouse.mb) {
            input.cameraX = -input.mouse.mx;
            input.cameraY = -input.mouse.my;
        }
        input.act = (!input.actButton && input.mouse.lb);
        input.sub = (!input.subButton && input.mouse.rb);
        input.actButton = input.mouse.lb;
        input.subButton = input.mouse.rb;
    } else if(mode === GAMEPAD_MODE_VIRTUAL_TOUCH) {
        input.moveX = 0;
        input.moveY = 0;
        input.cameraX = 0;
        input.cameraY = 0;
        for(const touch of input.touch.values()) {
            if(touch.sx < window.innerWidth/2) {
                // screen left
                input.moveX = (touch.x - touch.sx);
                input.moveY = -(touch.y - touch.sy);
            } else {
                // screen right
                input.cameraX = -(touch.x - touch.sx);
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

const listen_tick_mouse = (mouse) => {
    const halfValue = v => Math.trunc(v/2);
    mouse.mx = halfValue(mouse.mx);
    mouse.my = halfValue(mouse.my);
};

const listen_tick = () => {
    listen_tick_timer($listen.timer);
    listen_tick_gamepad($listen.input);
    listen_tick_input($listen.input);
    listen_tick_mouse($listen.input.mouse);
};
