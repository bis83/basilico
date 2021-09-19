
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
    const [getGamepad, setGamepad] = makeStoreGamepad();
    const [getFrame, setFrame] = makeStoreFrame();
    const [getSave, setSave] = makeStoreSave();
    setSave.scene(CFG.START.SCENE);
    setSave.position(CFG.START.POSITION[0], CFG.START.POSITION[1], CFG.START.POSITION[2]);
    setSave.angle(CFG.START.ANGLE[0], CFG.START.ANGLE[1]);

    // EventListener
    listen(window, "focus", (ev) => {
    });
    listen(window, "blur", (ev) => {
        setGamepad.blur(ev);
    });
    listen(window, "resize", (ev) => {
    });
    listen(window, "gamepadconnected", (ev) => {
        setGamepad.gamepadconnected(ev);
    });
    listen(window, "gamepaddisconnected", (ev) => {
        setGamepad.gamepaddisconnected(ev);
    });
    listen(document, "pointerlockchange", (ev) => {
        if(document.pointerLockElement === null) {
            if(getGamepad.mode() === GAMEPAD_MODE_MOUSE_KEYBOARD) {
            }
        }
    });
    listen(document, "pointerlockerror", (ev) => {
    });
    listen(document, "keydown", (ev) => {
        setGamepad.keydown(ev);
    });
    listen(document, "keyup", (ev) => {
        setGamepad.keyup(ev);
    });
    listen(document.body, "click", (ev) => {
        audio.resume();
        if(getGamepad.mode() === GAMEPAD_MODE_MOUSE_KEYBOARD) {
            if(document.pointerLockElement !== document.body) {
                document.body.requestPointerLock();
            }
        }
    });
    listen(document.body, "mousedown", (ev) => {
        setGamepad.mousedown(ev);
    });
    listen(document.body, "mouseup", (ev) => {
        setGamepad.mouseup(ev);
    });
    listen(document.body, "mousemove", (ev) => {
        setGamepad.mousemove(ev);
    });
    listen(document.body, "touchstart", (ev) => {
        setGamepad.touchstart(ev);
    });
    listen(document.body, "touchmove", (ev) => {
        setGamepad.touchmove(ev);
    });
    listen(document.body, "touchend", (ev) => {
        setGamepad.touchend(ev);
    });

    // AnimationLoop
    const tick = (time) => {
        // update
        setFrame.tick(time);
        setGamepad.tick();
        updatePlayer(getFrame, getGamepad, getSave, setSave);
        updateCamera(getSave, setFrame);

        // draw
        gl_resizeCanvas(gl);
        gl_clear(gl);
        drawProp(gl, bundle, getFrame, getSave);
        drawBillboard(gl, bundle, getFrame, getSave);
        requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
});
