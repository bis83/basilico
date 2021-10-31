
// init
const store_inputKeyboard = (store) => {
    store.input = store.input || {};
    store.input.keyboard = {
        w: false,
        a: false,
        s: false,
        d: false,
        space: false,
    };
};

// getter

// action
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
