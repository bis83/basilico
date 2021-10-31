
// init
const store_inputGamepad = (store) => {
    store.input = store.input || {};
    store.input.gamepad = {
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
};

// getter

// action
const store_inputGamepadConnectedAction = ({ input }, ev) => {
    input.gamepad.index = ev.gamepad.index;
    input.mode = GAMEPAD_MODE_GAMEPAD;
};
const store_inputGamepadDisconnectedAction = ({ input }, ev) => {
    if(input.gamepad.index === ev.gamepad.index) {
        input.gamepad.index = null;
    }
};
const store_inputGamepadTickAction = ({ input }) => {
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
};
