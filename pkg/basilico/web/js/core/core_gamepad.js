
const GAMEPAD_MODE_GAMEPAD = 0;
const GAMEPAD_MODE_MOUSE_KEYBOARD = 1;
const GAMEPAD_MODE_VIRTUAL_TOUCH = 2;

const makeCoreGamepad = () => {
    let mode = GAMEPAD_MODE_GAMEPAD;
    let mouseMovementX = 0;
    let mouseMovementY = 0;
    let mouse = {
        x: 0,
        y: 0,
        mx: 0,
        my: 0,
        lb: false,
        rb: false,
    };
    let keyboard = {
        w: false,
        a: false,
        s: false,
        d: false,
        space: false,
    };
    let touches = [];
    let gamepad = {
        lx: 0,
        ly: 0,
        rx: 0,
        ry: 0,
        b0: false,
        b1: false,
        lt: false,
        rt: false,
    };
    let gamepadIndex = null;

    const updateKeys = (code, value) => {
        switch(code) {
            case "KeyW": keyboard.w = value; break;
            case "KeyA": keyboard.a = value; break;
            case "KeyS": keyboard.s = value; break;
            case "KeyD": keyboard.d = value; break;
            case "Space": keyboard.space = value; break;
            default: return false;
        }
        return true;
    };

    const blur = (ev) => {
        // TODO: Reset
    };
    const gamepadconnected = (ev) => {
        gamepadIndex = ev.gamepad.index;
        mode = GAMEPAD_MODE_GAMEPAD;
    };
    const gamepaddisconnected = (ev) => {
        if(gamepadIndex === ev.gamepad.index) {
            gamepadIndex = null;
        }
    };
    const keydown = (ev) => {
        if(updateKeys(ev.code, true)) {
            mode = GAMEPAD_MODE_MOUSE_KEYBOARD;
            ev.preventDefault();
        }
    };
    const keyup = (ev) => {
        if(updateKeys(ev.code, false)) {
            mode = GAMEPAD_MODE_MOUSE_KEYBOARD;
            ev.preventDefault();
        }
    };
    const mousedown =  (ev) => {
        mouse.x = ev.x;
        mouse.y = ev.y;
        mouse.lb = (ev.buttons & 1) !== 0;
        mouse.rb = (ev.buttons & 2) !== 0;
        mode = GAMEPAD_MODE_MOUSE_KEYBOARD;
        ev.preventDefault();
    };
    const mouseup = (ev) => {
        mouse.x = ev.x;
        mouse.y = ev.y;
        mouse.lb = (ev.buttons & 1) !== 0;
        mouse.rb = (ev.buttons & 2) !== 0;
        mode = GAMEPAD_MODE_MOUSE_KEYBOARD;
        ev.preventDefault();
    };
    const mousemove = (ev) => {
        mouseMovementX += ev.movementX || 0;
        mouseMovementY += ev.movementY || 0;
        mouse.x = ev.x;
        mouse.y = ev.y;
        mouse.lb = (ev.buttons & 1) !== 0;
        mouse.rb = (ev.buttons & 2) !== 0;
        mode = GAMEPAD_MODE_MOUSE_KEYBOARD;
        ev.preventDefault();
    };
    const touchstart = (ev) => {
        mode = GAMEPAD_MODE_VIRTUAL_TOUCH;
    };
    const touchmove = (ev) => {
        mode = GAMEPAD_MODE_VIRTUAL_TOUCH;
    };
    const touchend = (ev) => {
        mode = GAMEPAD_MODE_VIRTUAL_TOUCH;
    };

    const tick = () => {
        if(gamepadIndex !== null) {
            const gamepads = navigator.getGamepads();
            const gp = gamepads[gamepadIndex];
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
                mode = GAMEPAD_MODE_GAMEPAD;
            }
        }
        mouse.mx = mouseMovementX;
        mouse.my = mouseMovementY;
        mouseMovementX = 0;
        mouseMovementY = 0;
    }
    return {
        blur: blur,
        gamepadconnected: gamepadconnected,
        gamepaddisconnected: gamepaddisconnected,
        keydown: keydown,
        keyup: keyup,
        mousedown: mousedown,
        mouseup: mouseup,
        mousemove: mousemove,
        touchstart: touchstart,
        touchmove: touchmove,
        touchend: touchend,
        tick: tick,
        mode: () => mode,
    };
};