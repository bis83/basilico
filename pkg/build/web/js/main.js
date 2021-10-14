
listen(window, "load", () => {
    const gl = gl_createContext();
    const audio = audio_createContext();
    const store = { gl, audio };
    store_bundle(store);
    store_frame(store);
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
    listen(document, "pointerlockchange", (ev) => {
        if(document.pointerLockElement === null) {
            if(store.gamepad.mode === GAMEPAD_MODE_MOUSE_KEYBOARD) {
            }
        }
    });
    listen(document, "keydown", (ev) => {
        store_gamepadKeydownAction(store, ev);
    });
    listen(document, "keyup", (ev) => {
        store_gamepadKeyupAction(store, ev);
    });
    listen(document.body, "click", (ev) => {
        if(store.gamepad.mode === GAMEPAD_MODE_MOUSE_KEYBOARD) {
            if(document.pointerLockElement !== document.body) {
                document.body.requestPointerLock();
            }
        }
    });
    listen(document.body, "mousedown", (ev) => {
        store_gamepadMousedownAction(store, ev);
    });
    listen(document.body, "mouseup", (ev) => {
        store_gamepadMouseupAction(store, ev);
    });
    listen(document.body, "mousemove", (ev) => {
        store_gamepadMousemoveAction(store, ev);
    });
    listen(document.body, "touchstart", (ev) => {
        store_gamepadTouchstartAction(store, ev);
    });
    listen(document.body, "touchmove", (ev) => {
        store_gamepadTouchmoveAction(store, ev);
    });
    listen(document.body, "touchend", (ev) => {
        store_gamepadTouchendAction(store, ev);
    });

    // AnimationLoop
    const update = () => {
        updateStartFrame(store);
        updatePlayer(store);
        updateCamera(store);
    };
    const draw = () => {
        drawStartFrame(store);
        drawProp(store);
    };
    const tick = () => {
        update();
        draw();
        requestAnimationFrame(tick);
    };
    tick();
});
