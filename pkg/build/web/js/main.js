
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

const listen = (target, key, func) => {
    target.addEventListener(key, func);
};
listen(window, "load", () => {
    const canvas = document.getElementById("main");
    ASSERT && console.assert(canvas !== null);
    const gl = canvas.getContext("webgl2");
    ASSERT && console.assert(gl !== null);
    const audio = new AudioContext();
    ASSERT && console.assert(audio !== null);
    // const masterNode = audio.createGain();
    // masterNode.gain.value = masterVolume();
    // masterNode.connect(audio.destination);

    // load
    const bundle = makeLoadBundle(gl);
    // {{range $key, $value := .Spec}}
    bundle.load("{{$key}}");
    // {{end}}

    // store
    const gamepad = makeStoreGamepad();
    const frame = makeStoreFrame();
    const save = makeStoreSave();
    save.setScene(CFG.START.SCENE);
    save.setPosition(CFG.START.POSITION[0], CFG.START.POSITION[1], CFG.START.POSITION[2]);
    save.setAngle(CFG.START.ANGLE[0], CFG.START.ANGLE[1]);

    // EventListener
    listen(window, "focus", (ev) => {
    });
    listen(window, "blur", (ev) => {
        gamepad.blur(ev);
    });
    listen(window, "resize", (ev) => {
    });
    listen(window, "gamepadconnected", (ev) => {
        gamepad.gamepadconnected(ev);
    });
    listen(window, "gamepaddisconnected", (ev) => {
        gamepad.gamepaddisconnected(ev);
    });
    listen(document, "pointerlockchange", (ev) => {
        if(document.pointerLockElement === null) {
            if(gamepad.mode() === GAMEPAD_MODE_MOUSE_KEYBOARD) {
            }
        }
    });
    listen(document, "pointerlockerror", (ev) => {
    });
    listen(document, "keydown", (ev) => {
        gamepad.keydown(ev);
    });
    listen(document, "keyup", (ev) => {
        gamepad.keyup(ev);
    });
    listen(document.body, "click", (ev) => {
        audio.resume();
        if(gamepad.mode() === GAMEPAD_MODE_MOUSE_KEYBOARD) {
            if(document.pointerLockElement !== document.body) {
                document.body.requestPointerLock();
            }
        }
    });
    listen(document.body, "mousedown", (ev) => {
        gamepad.mousedown(ev);
    });
    listen(document.body, "mouseup", (ev) => {
        gamepad.mouseup(ev);
    });
    listen(document.body, "mousemove", (ev) => {
        gamepad.mousemove(ev);
    });
    listen(document.body, "touchstart", (ev) => {
        gamepad.touchstart(ev);
    });
    listen(document.body, "touchmove", (ev) => {
        gamepad.touchmove(ev);
    });
    listen(document.body, "touchend", (ev) => {
        gamepad.touchend(ev);
    });

    // AnimationLoop
    const tick = (time) => {
        // update
        gamepad.tick();
        updatePlayer(gamepad, save);
        updateCamera(save, frame);

        // draw
        gl_resizeCanvas(gl);
        gl_clear(gl);
        drawProp(gl, frame, save, bundle);
        drawBillboard(gl, frame, save, bundle);
        requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
});
