
const GAMEPAD_MODE_GAMEPAD = 0;
const GAMEPAD_MODE_MOUSE_KEYBOARD = 1;
const GAMEPAD_MODE_VIRTUAL_TOUCH = 2;

const updateKeys = (keyboard, code, value) => {
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
const updateMouse = (mouse, ev) => {
    mouse.mx += ev.movementX || 0;
    mouse.my += ev.movementY || 0;
    mouse.x = ev.x;
    mouse.y = ev.y;
    mouse.lb = (ev.buttons & 1) !== 0;
    mouse.rb = (ev.buttons & 2) !== 0;
    return true;
};

// init
const store_input = (store) => {
    store.input = {
        mode: GAMEPAD_MODE_GAMEPAD,
        moveX: 0,
        moveY: 0,
        cameraX: 0,
        cameraY: 0,
        touches: new Map(),
        mouse: {
            x: 0,
            y: 0,
            mx: 0,
            my: 0,
            lb: false,
            rb: false,
        },
        keyboard: {
            w: false,
            a: false,
            s: false,
            d: false,
            space: false,
        },
        gamepadIndex: null,
        gamepad: {
            lx: 0,
            ly: 0,
            rx: 0,
            ry: 0,
            b0: false,
            b1: false,
            lt: false,
            rt: false,
        }
    };
    return store;
};

// getter

// action
const store_inputTickAction = ({ input }) => {
    const updateGamepad = () => {
        if(input.gamepadIndex !== null) {
            const gamepads = navigator.getGamepads();
            const gp = gamepads[input.gamepadIndex];
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
    };
    const tickModeNone = () => {
        input.moveX = 0;
        input.moveY = 0;
        input.cameraX = 0;
        input.cameraY = 0;
    };
    const tickModeGamepad = () => {
        input.moveX = input.gamepad.lx;
        input.moveY = -input.gamepad.ly;
        input.cameraX = -input.gamepad.rx;
        input.cameraY = -input.gamepad.ry;
    };
    const tickModeMouseKeyboard = () => {
        input.moveX = input.keyboard.a ? -1 : input.keyboard.d ? +1 : 0;
        input.moveY = input.keyboard.w ? +1 : input.keyboard.s ? -1 : 0;
        if(input.mouse.lb) {
            input.cameraX = -input.mouse.mx;
            input.cameraY = -input.mouse.my;
        } else {
            input.cameraX = 0;
            input.cameraY = 0;
        }

    };
    const tickModeVirtualTouch = () => {
        input.moveX = 0;
        input.moveY = 0;
        input.cameraX = 0;
        input.cameraY = 0;
        for(const touch of input.touches.values()) {
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
    };
    const normalizeXY = () => {
        [input.moveX, input.moveY] = xy_normalize(input.moveX, input.moveY);
        [input.cameraX, input.cameraY] = xy_normalize(input.cameraX, input.cameraY);
    };
    const halfMouseMove = () => {
        const halfValue = v => Math.trunc(v/2);
        input.mouse.mx = halfValue(input.mouse.mx);
        input.mouse.my = halfValue(input.mouse.my);
    };

    updateGamepad();
    if(input.mode === GAMEPAD_MODE_GAMEPAD) {
        tickModeGamepad();
    } else if(input.mode === GAMEPAD_MODE_MOUSE_KEYBOARD) {
        tickModeMouseKeyboard();
    } else if(input.mode === GAMEPAD_MODE_VIRTUAL_TOUCH) {
        tickModeVirtualTouch();
    } else {
        tickModeNone();
    }
    normalizeXY();
    halfMouseMove();
};

const store_inputBlurAction = ({ input }, ev) => {
};
const store_inputGamepadConnectedAction = ({ input }, ev) => {
    input.gamepadIndex = ev.gamepad.index;
    input.mode = GAMEPAD_MODE_GAMEPAD;
};
const store_inputGamepaDisconnectedAction = ({ input }, ev) => {
    if(input.gamepadIndex === ev.gamepad.index) {
        input.gamepadIndex = null;
    }
};
const store_inputKeyDownAction = ({ input }, ev) => {
    if(updateKeys(input.keyboard, ev.code, true)) {
        input.mode = GAMEPAD_MODE_MOUSE_KEYBOARD;
        ev.preventDefault();
    }
};
const store_inputKeyUpAction = ({ input }, ev) => {
    if(updateKeys(input.keyboard, ev.code, false)) {
        input.mode = GAMEPAD_MODE_MOUSE_KEYBOARD;
        ev.preventDefault();
    }
};
const store_inputMouseDownAction =  ({ input }, ev) => {
    if(updateMouse(input.mouse, ev)) {
        input.mode = GAMEPAD_MODE_MOUSE_KEYBOARD;
        ev.preventDefault();        
    }
};
const store_inputMouseUpAction = ({ input }, ev) => {
    if(updateMouse(input.mouse, ev)) {
        input.mode = GAMEPAD_MODE_MOUSE_KEYBOARD;
        ev.preventDefault();        
    }
};
const store_inputMouseMoveAction = ({ input }, ev) => {
    if(updateMouse(input.mouse, ev)) {
        input.mode = GAMEPAD_MODE_MOUSE_KEYBOARD;
        ev.preventDefault();        
    }
};
const store_inputTouchStartAction =  ({ input }, ev) => {
    for(const t of ev.changedTouches) {
        input.touches.set(t.identifier, {
            x: t.clientX,
            y: t.clientY,
            sx: t.clientX,
            sy: t.clientY
        });
    }
    input.mode = GAMEPAD_MODE_VIRTUAL_TOUCH;
};
const store_inputTouchEndAction = ({ input }, ev) => {
    for(const t of ev.changedTouches) {
        input.touches.delete(t.identifier);
    }
    input.mode = GAMEPAD_MODE_VIRTUAL_TOUCH;
};
const store_inputTouchMoveAction = ({ input }, ev) => {
    for(const t of ev.changedTouches) {
        const touch = input.touches.get(t.identifier);
        if(touch) {
            touch.x = t.clientX;
            touch.y = t.clientY;
        }
    }
    input.mode = GAMEPAD_MODE_VIRTUAL_TOUCH;
};
