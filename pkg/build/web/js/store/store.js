
const store_init = () => {
    const canvas = document.getElementById("main");
    ASSERT && console.assert(canvas !== null);
    const gl = canvas.getContext("webgl2");
    ASSERT && console.assert(gl !== null);
    const audio = new AudioContext();
    ASSERT && console.assert(audio !== null);

    const store = { gl, audio };
    store_bundle(store);
    store_input(store);
    store_camera(store);
    store_timer(store);
    store_save(store);

    const CFG = {
        START: {
            SCENE: "{{.Cfg.Start.Scene}}",
            POSITION: [
                parseFloat("{{index .Cfg.Start.Position 0}}"),
                parseFloat("{{index .Cfg.Start.Position 1}}"),
                parseFloat("{{index .Cfg.Start.Position 2}}")
            ],
            ANGLE: [
                parseFloat("{{index .Cfg.Start.Angle 0}}"),
                parseFloat("{{index .Cfg.Start.Angle 1}}")
            ]
        },
    };    
    store_saveSceneAction(store, CFG.START.SCENE);
    store_savePositionAction(store, CFG.START.POSITION[0], CFG.START.POSITION[1], CFG.START.POSITION[2]);
    store_saveAngleAction(store, CFG.START.ANGLE[0], CFG.START.ANGLE[1]);
    store_bundleLoadAction(store, "core");

    // listen
    listen(window, "focus", (ev) => {
    });
    listen(window, "blur", (ev) => {
        store_inputBlurAction(store, ev);
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
    listen(canvas, "mousedown", (ev) => {
        store_inputMouseDownAction(store, ev);
    });
    listen(canvas, "mouseup", (ev) => {
        store_inputMouseUpAction(store, ev);
    });
    listen(canvas, "mousemove", (ev) => {
        store_inputMouseMoveAction(store, ev);
    });
    listen(canvas, "touchstart", (ev) => {
        store_inputTouchStartAction(store, ev);
    });
    listen(canvas, "touchend", (ev) => {
        store_inputTouchEndAction(store, ev);
    });
    listen(canvas, "touchcancel", (ev) => {
        store_inputTouchEndAction(store, ev);
    });
    listen(canvas, "touchmove", (ev) => {
        store_inputTouchMoveAction(store, ev);
    });    

    return store;
};
