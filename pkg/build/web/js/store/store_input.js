
const GAMEPAD_MODE_GAMEPAD = 0;
const GAMEPAD_MODE_MOUSE_KEYBOARD = 1;
const GAMEPAD_MODE_VIRTUAL_TOUCH = 2;

// init
const store_input = (store) => {
    store.input = {
        mode: GAMEPAD_MODE_GAMEPAD,
        moveX: 0,
        moveY: 0,
        cameraX: 0,
        cameraY: 0,
        jump: false,
        sneak: false,
        jumpButton: false,
        sneakButton: false,
    };
};

// getter

// action
const input_normalizeXY = (input) => {
    [input.moveX, input.moveY] = xy_normalize(input.moveX, input.moveY);
    [input.cameraX, input.cameraY] = xy_normalize(input.cameraX, input.cameraY);
};
const store_inputResetAction = ({ input }) => {
    input.moveX = 0;
    input.moveY = 0;
    input.cameraX = 0;
    input.cameraY = 0;
};
const store_inputTickGamepadModeAction = ({ input }) => {
    input.moveX = input.gamepad.lx;
    input.moveY = -input.gamepad.ly;
    input.cameraX = -input.gamepad.rx;
    input.cameraY = -input.gamepad.ry;
    input.jump = (!input.jumpButton && input.gamepad.b0);
    input.sneak = (!input.sneakButton && input.gamepad.b1);
    input.jumpButton = input.gamepad.b0;
    input.sneakButton = input.gamepad.b1;
};
const store_inputTickMouseKeyboardModeAction = ({ input }) => {
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
const store_inputTickTouchModeAction = ({ input }) => {
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
};
