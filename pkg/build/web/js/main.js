
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

window.addEventListener("load", () => {
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
    window.addEventListener("focus", (ev) => {
    });
    window.addEventListener("blur", (ev) => {
        gamepad.blur(ev);
    });
    window.addEventListener("resize", (ev) => {
    });
    window.addEventListener("gamepadconnected", (ev) => {
        gamepad.gamepadconnected(ev);
    });
    window.addEventListener("gamepaddisconnected", (ev) => {
        gamepad.gamepaddisconnected(ev);
    });
    document.body.addEventListener("click", (ev) => {
        audio.resume();
        if(gamepad.mode() === GAMEPAD_MODE_MOUSE_KEYBOARD) {
            if(document.pointerLockElement !== document.body) {
                document.body.requestPointerLock();
            }
        }
    });
    document.addEventListener("pointerlockchange", (ev) => {
        if(document.pointerLockElement === null) {
            if(gamepad.mode() === GAMEPAD_MODE_MOUSE_KEYBOARD) {
            }
        }
    });
    document.addEventListener("pointerlockerror", (ev) => {
    });
    document.addEventListener("keydown", (ev) => {
        gamepad.keydown(ev);
    });
    document.addEventListener("keyup", (ev) => {
        gamepad.keyup(ev);
    });
    document.body.addEventListener("mousedown", (ev) => {
        gamepad.mousedown(ev);
    });
    document.body.addEventListener("mouseup", (ev) => {
        gamepad.mouseup(ev);
    });
    document.body.addEventListener("mousemove", (ev) => {
        gamepad.mousemove(ev);
    });
    document.body.addEventListener("touchstart", (ev) => {
        gamepad.touchstart(ev);
    });
    document.body.addEventListener("touchmove", (ev) => {
        gamepad.touchmove(ev);
    });
    document.body.addEventListener("touchend", (ev) => {
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
