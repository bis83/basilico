
const updateStartFrame = (store) => {
    store_timerTickAction(store);
    store_inputGamepadTickAction(store);

    const mode = store.input.mode;
    if(mode === GAMEPAD_MODE_GAMEPAD) {
        store_inputTickGamepadModeAction(store);
    } else if(mode === GAMEPAD_MODE_MOUSE_KEYBOARD) {
        store_inputTickMouseKeyboardModeAction(store);
    } else if(mode === GAMEPAD_MODE_VIRTUAL_TOUCH) {
        store_inputTickTouchModeAction(store);
    } else {
        store_inputResetAction(store);
    }
    input_normalizeXY(store.input);
    halfMouseMove(store.input.mouse);
};
