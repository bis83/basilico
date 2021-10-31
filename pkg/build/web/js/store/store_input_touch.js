
// init
const store_inputTouch = (store) => {
    store.input = store.input || {};
    store.input.touch = new Map();
};

// getter

// action
const store_inputTouchStartAction =  ({ input }, ev) => {
    for(const t of ev.changedTouches) {
        input.touch.set(t.identifier, {
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
        input.touch.delete(t.identifier);
    }
    input.mode = GAMEPAD_MODE_VIRTUAL_TOUCH;
};
const store_inputTouchMoveAction = ({ input }, ev) => {
    for(const t of ev.changedTouches) {
        const touch = input.touch.get(t.identifier);
        if(touch) {
            touch.x = t.clientX;
            touch.y = t.clientY;
        }
    }
    input.mode = GAMEPAD_MODE_VIRTUAL_TOUCH;
};
