
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

// store
const store_gamepad = (store) => {
    store.gamepad = {
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
const store_gamepadTickAction = ({ gamepad }) => {
    const updateGamepad = () => {
        if(gamepad.gamepadIndex !== null) {
            const gamepads = navigator.getGamepads();
            const gp = gamepads[gamepad.gamepadIndex];
            gamepad.gamepad.lx = Math.trunc(gp.axes[0] * 4) / 4;
            gamepad.gamepad.ly = Math.trunc(gp.axes[1] * 4) / 4;
            gamepad.gamepad.rx = Math.trunc(gp.axes[2] * 4) / 4;
            gamepad.gamepad.ry = Math.trunc(gp.axes[3] * 4) / 4;
            gamepad.gamepad.b0 = (gp.buttons[0].value >= 0.5);
            gamepad.gamepad.b1 = (gp.buttons[1].value >= 0.5);
            gamepad.gamepad.lt = (gp.buttons[6].value >= 0.5);
            gamepad.gamepad.rt = (gp.buttons[7].value >= 0.5);
            const gamepadChanged =
                (gamepad.gamepad.lx || gamepad.gamepad.ly || gamepad.gamepad.rx || gamepad.gamepad.ry ||
                 gamepad.gamepad.b0 || gamepad.gamepad.b1 || gamepad.gamepad.lt || gamepad.gamepad.rt) ? true : false;
            if(gamepadChanged) {
                gamepad.mode = GAMEPAD_MODE_GAMEPAD;
            }
        }
    };
    const tickModeNone = () => {
        gamepad.moveX = 0;
        gamepad.moveY = 0;
        gamepad.cameraX = 0;
        gamepad.cameraY = 0;
    };
    const tickModeGamepad = () => {
        gamepad.moveX = gamepad.gamepad.lx;
        gamepad.moveY = -gamepad.gamepad.ly;
        gamepad.cameraX = -gamepad.gamepad.rx;
        gamepad.cameraY = -gamepad.gamepad.ry;
    };
    const tickModeMouseKeyboard = () => {
        gamepad.moveX = gamepad.keyboard.a ? -1 : gamepad.keyboard.d ? +1 : 0;
        gamepad.moveY = gamepad.keyboard.w ? +1 : gamepad.keyboard.s ? -1 : 0;
        if(gamepad.mouse.lb) {
            gamepad.cameraX = -gamepad.mouse.mx;
            gamepad.cameraY = -gamepad.mouse.my;
        } else {
            gamepad.cameraX = 0;
            gamepad.cameraY = 0;
        }

    };
    const tickModeVirtualTouch = () => {
        gamepad.moveX = 0;
        gamepad.moveY = 0;
        gamepad.cameraX = 0;
        gamepad.cameraY = 0;
        for(const touch of gamepad.touches.values()) {
            if(touch.sx < window.innerWidth/2) {
                // screen left
                gamepad.moveX = (touch.x - touch.sx);
                gamepad.moveY = -(touch.y - touch.sy);
            } else {
                // screen right
                gamepad.cameraX = -(touch.x - touch.sx);
                gamepad.cameraY = -(touch.y - touch.sy);
            }
        }
    };
    const normalizeXY = () => {
        [gamepad.moveX, gamepad.moveY] = xy_normalize(gamepad.moveX, gamepad.moveY);
        [gamepad.cameraX, gamepad.cameraY] = xy_normalize(gamepad.cameraX, gamepad.cameraY);
    };
    const halfMouseMove = () => {
        const halfValue = v => Math.trunc(v/2);
        gamepad.mouse.mx = halfValue(gamepad.mouse.mx);
        gamepad.mouse.my = halfValue(gamepad.mouse.my);
    };

    updateGamepad();
    if(gamepad.mode === GAMEPAD_MODE_GAMEPAD) {
        tickModeGamepad();
    } else if(gamepad.mode === GAMEPAD_MODE_MOUSE_KEYBOARD) {
        tickModeMouseKeyboard();
    } else if(gamepad.mode === GAMEPAD_MODE_VIRTUAL_TOUCH) {
        tickModeVirtualTouch();
    } else {
        tickModeNone();
    }
    normalizeXY();
    halfMouseMove();
};

const store_gamepadBlurAction = ({ gamepad }, ev) => {
};
const store_gamepadGamepadConnectedAction = ({ gamepad }, ev) => {
    gamepad.gamepadIndex = ev.gamepad.index;
    gamepad.mode = GAMEPAD_MODE_GAMEPAD;
};
const store_gamepadGamepaDisconnectedAction = ({ gamepad }, ev) => {
    if(gamepad.gamepadIndex === ev.gamepad.index) {
        gamepad.gamepadIndex = null;
    }
};
const store_gamepadKeydownAction = ({ gamepad }, ev) => {
    if(updateKeys(gamepad.keyboard, ev.code, true)) {
        gamepad.mode = GAMEPAD_MODE_MOUSE_KEYBOARD;
        ev.preventDefault();
    }
};
const store_gamepadKeyupAction = ({ gamepad }, ev) => {
    if(updateKeys(gamepad.keyboard, ev.code, false)) {
        gamepad.mode = GAMEPAD_MODE_MOUSE_KEYBOARD;
        ev.preventDefault();
    }
};
const store_gamepadMouseDownAction =  ({ gamepad }, ev) => {
    gamepad.mouse.x = ev.x;
    gamepad.mouse.y = ev.y;
    gamepad.mouse.lb = (ev.buttons & 1) !== 0;
    gamepad.mouse.rb = (ev.buttons & 2) !== 0;
    gamepad.mode = GAMEPAD_MODE_MOUSE_KEYBOARD;
    ev.preventDefault();
};
const store_gamepadMouseUpAction = ({ gamepad }, ev) => {
    gamepad.mouse.x = ev.x;
    gamepad.mouse.y = ev.y;
    gamepad.mouse.lb = (ev.buttons & 1) !== 0;
    gamepad.mouse.rb = (ev.buttons & 2) !== 0;
    gamepad.mode = GAMEPAD_MODE_MOUSE_KEYBOARD;
    ev.preventDefault();
};
const store_gamepadMouseMoveAction = ({ gamepad }, ev) => {
    gamepad.mouse.mx += ev.movementX || 0;
    gamepad.mouse.my += ev.movementY || 0;
    gamepad.mouse.x = ev.x;
    gamepad.mouse.y = ev.y;
    gamepad.mouse.lb = (ev.buttons & 1) !== 0;
    gamepad.mouse.rb = (ev.buttons & 2) !== 0;
    gamepad.mode = GAMEPAD_MODE_MOUSE_KEYBOARD;
    ev.preventDefault();
};
const store_gamepadTouchStartAction =  ({ gamepad }, ev) => {
    for(const t of ev.changedTouches) {
        gamepad.touches.set(t.identifier, {
            x: t.clientX,
            y: t.clientY,
            sx: t.clientX,
            sy: t.clientY
        });
    }
    gamepad.mode = GAMEPAD_MODE_VIRTUAL_TOUCH;
};
const store_gamepadTouchEndAction = ({ gamepad }, ev) => {
    for(const t of ev.changedTouches) {
        gamepad.touches.delete(t.identifier);
    }
    gamepad.mode = GAMEPAD_MODE_VIRTUAL_TOUCH;
};
const store_gamepadTouchMoveAction = ({ gamepad }, ev) => {
    for(const t of ev.changedTouches) {
        const touch = gamepad.touches.get(t.identifier);
        if(touch) {
            touch.x = t.clientX;
            touch.y = t.clientY;
        }
    }
    gamepad.mode = GAMEPAD_MODE_VIRTUAL_TOUCH;
};

