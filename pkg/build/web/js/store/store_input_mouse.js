
// init
const store_inputMouse = (store) => {
    store.input = store.input || {};
    store.input.mouse = {
        x: 0,
        y: 0,
        mx: 0,
        my: 0,
        lb: false,
        rb: false,
    };
};

// getter

// action
const updateMouse = (mouse, ev) => {
    mouse.mx += ev.movementX || 0;
    mouse.my += ev.movementY || 0;
    mouse.x = ev.x;
    mouse.y = ev.y;
    mouse.lb = (ev.buttons & 1) !== 0;
    mouse.rb = (ev.buttons & 2) !== 0;
    return true;
};
const halfMouseMove = (mouse) => {
    const halfValue = v => Math.trunc(v/2);
    mouse.mx = halfValue(mouse.mx);
    mouse.my = halfValue(mouse.my);
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
