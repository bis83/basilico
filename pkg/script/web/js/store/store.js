
var $store = null;

const store_init = () => {
    const store = {};
    store_input(store);
    store_inputMouse(store);
    store_inputKeyboard(store);
    store_inputGamepad(store);
    store_inputTouch(store);
    store_camera(store);
    store_timer(store);
    store_save(store);
    store_saveStartPositionAction(store);

    // listen
    listen(window, "focus", (ev) => {
    });
    listen(window, "blur", (ev) => {
    });
    listen(window, "resize", (ev) => {
    });
    listen(window, "gamepadconnected", (ev) => {
        LOGGING && console.log("gamepadconnected: " + ev.gamepad.index);
        store_inputGamepadConnectedAction(store, ev);
    });
    listen(window, "gamepaddisconnected", (ev) => {
        LOGGING && console.log("gamepaddisconnected: " + ev.gamepad.index);
        store_inputGamepadDisconnectedAction(store, ev);
    });
    listen(document, "keydown", (ev) => {
        store_inputKeyDownAction(store, ev);
    });
    listen(document, "keyup", (ev) => {
        store_inputKeyUpAction(store, ev);
    });
    listen(document.body, "contextmenu", (ev) => {
        ev.preventDefault();
    });
    listen(document.body, "mousedown", (ev) => {
        store_inputMouseDownAction(store, ev);
    });
    listen(document.body, "mouseup", (ev) => {
        store_inputMouseUpAction(store, ev);
    });
    listen(document.body, "mousemove", (ev) => {
        store_inputMouseMoveAction(store, ev);
    });
    listen(document.body, "touchstart", (ev) => {
        store_inputTouchStartAction(store, ev);
    });
    listen(document.body, "touchend", (ev) => {
        store_inputTouchEndAction(store, ev);
    });
    listen(document.body, "touchcancel", (ev) => {
        store_inputTouchEndAction(store, ev);
    });
    listen(document.body, "touchmove", (ev) => {
        store_inputTouchMoveAction(store, ev);
    });

    $store = store;
};
