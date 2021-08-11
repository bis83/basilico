
const makeCoreBrowser = () => {
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
    let isPointerLocked = false;
    let isMouseChanged = [false, false];
    let isKeyboardChanged = [false, false];
    let isTouchChanged = [false, false];
    let isGamepadChanged = [false, false];
    let isSuspend = true;

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
        isSuspend = true;
    };
    const gamepadconnected = (ev) => {
        gamepadIndex = ev.gamepad.index;
        isGamepadChanged[1] = true;
    };
    const gamepaddisconnected = (ev) => {
        if(gamepadIndex === ev.gamepad.index) {
            gamepadIndex = null;
        }
    };
    const pointerlockchange = (ev) => {
        isPointerLocked = (document.pointerLockElement === document.body);
        if(!isPointerLocked) {
            isSuspend = true;
        }
    };
    const keydown = (ev) => {
        if(updateKeys(ev.code, true)) {
            isKeyboardChanged[1] = true;
            ev.preventDefault();
        }
    };
    const keyup = (ev) => {
        if(updateKeys(ev.code, false)) {
            isKeyboardChanged[1] = true;
            ev.preventDefault();
        }
    };
    const mousedown =  (ev) => {
        mouse.x = ev.x;
        mouse.y = ev.y;
        mouse.lb = (ev.buttons & 1) !== 0;
        mouse.rb = (ev.buttons & 2) !== 0;
        isMouseChanged[1] = true;
        ev.preventDefault();
    };
    const mouseup = (ev) => {
        mouse.x = ev.x;
        mouse.y = ev.y;
        mouse.lb = (ev.buttons & 1) !== 0;
        mouse.rb = (ev.buttons & 2) !== 0;
        isMouseChanged[1] = true;
        ev.preventDefault();
    };
    const mousemove = (ev) => {
        mouseMovementX += ev.movementX || 0;
        mouseMovementY += ev.movementY || 0;
        mouse.x = ev.x;
        mouse.y = ev.y;
        mouse.lb = (ev.buttons & 1) !== 0;
        mouse.rb = (ev.buttons & 2) !== 0;
        isMouseChanged[1] = true;
        ev.preventDefault();
    };
    const touchstart = (ev) => {
        isTouchChanged[1] = true;
    };
    const touchmove = (ev) => {
        isTouchChanged[1] = true;
    };
    const touchend = (ev) => {
        isTouchChanged[1] = true;
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
            isGamepadChanged[1] =
                (gamepad.lx || gamepad.ly || gamepad.rx || gamepad.ry ||
                 gamepad.b0 || gamepad.b1 || gamepad.lt || gamepad.rt) ? true : false;
            if(gp.buttons[9].value >= 0.5) {
                isSuspend = true;
                document.exitPointerLock();
            }
        }

        mouse.mx = mouseMovementX;
        mouse.my = mouseMovementY;
        mouseMovementX = 0;
        mouseMovementY = 0;
        isMouseChanged[0] = isMouseChanged[1];
        isMouseChanged[1] = false;

        isKeyboardChanged[0] = isKeyboardChanged[1];
        isKeyboardChanged[1] = false;
        isTouchChanged[0] = isTouchChanged[1];
        isTouchChanged[1] = false;
        isGamepadChanged[0] = isGamepadChanged[1];
        isGamepadChanged[1] = false;
    }
    const resume = (pointerLock) => {
        isSuspend = false;
        if(pointerLock && !isPointerLocked) {
            document.body.requestPointerLock();
        }
    };
    return {
        tick: tick,
        resume: resume,
        mouse: () => mouse,
        mouseChanged: () => isMouseChanged[0],
        keys: () => keyboard,
        keysChanged: () => isKeyboardChanged[0],
        touch: () => touches,
        touchChanged: () => isTouchChanged[0],
        gpad: () => gamepad,
        gpadChanged: () => isGamepadChanged[0],
        suspend: () => isSuspend,
        blur: blur,
        gamepadconnected: gamepadconnected,
        gamepaddisconnected: gamepaddisconnected,
        pointerlockchange: pointerlockchange,
        keydown: keydown,
        keyup: keyup,
        mousedown: mousedown,
        mouseup: mouseup,
        mousemove: mousemove,
        touchstart: touchstart,
        touchmove: touchmove,
        touchend: touchend,
    };
};
