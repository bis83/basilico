
listen(window, "load", () => {
    const canvas = document.getElementById("main");
    ASSERT && console.assert(canvas !== null);
    const gl = canvas.getContext("webgl2");
    ASSERT && console.assert(gl !== null);
    const audio = new AudioContext();
    ASSERT && console.assert(audio !== null);

    const store = { gl, audio };
    store_bundle(store);
    store_camera(store);
    store_timer(store);
    store_gamepad(store);
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
        store_gamepadBlurAction(store, ev);
    });
    listen(window, "resize", (ev) => {
    });
    listen(window, "gamepadconnected", (ev) => {
        LOGGING && console.log("gamepadconnected: " + ev.gamepad.index);
        store_gamepadGamepadConnectedAction(store, ev);
    });
    listen(window, "gamepaddisconnected", (ev) => {
        LOGGING && console.log("gamepaddisconnected: " + ev.gamepad.index);
        store_gamepadGamepadDisconnectedAction(store, ev);
    });
    listen(document, "keydown", (ev) => {
        store_gamepadKeydownAction(store, ev);
    });
    listen(document, "keyup", (ev) => {
        store_gamepadKeyupAction(store, ev);
    });
    listen(canvas, "mousedown", (ev) => {
        store_gamepadMouseDownAction(store, ev);
    });
    listen(canvas, "mouseup", (ev) => {
        store_gamepadMouseUpAction(store, ev);
    });
    listen(canvas, "mousemove", (ev) => {
        store_gamepadMouseMoveAction(store, ev);
    });
    listen(canvas, "touchstart", (ev) => {
        store_gamepadTouchStartAction(store, ev);
    });
    listen(canvas, "touchend", (ev) => {
        store_gamepadTouchEndAction(store, ev);
    });
    listen(canvas, "touchcancel", (ev) => {
        store_gamepadTouchEndAction(store, ev);
    });
    listen(canvas, "touchmove", (ev) => {
        store_gamepadTouchMoveAction(store, ev);
    });

    // AnimationLoop
    const tick = () => {
        update(store);
        draw(store);
        requestAnimationFrame(tick);
    };
    tick();
});
