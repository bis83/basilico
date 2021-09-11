
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
    // CoreSystem
    const audio = makeCoreAudio();
    const engine = makeCoreEngine();
    const gamepad = makeCoreGamepad();
    const graphics = makeCoreGraphics();
    const userdata = makeCoreUserData();    
    const loader = makeBundleLoader(graphics);
    const update = [
        updatePlayer(gamepad, graphics, userdata),
    ];
    const draw = [
        drawProp(graphics, userdata, loader),
        drawBillboard(engine, graphics),
    ];

    // {{range $key, $value := .Spec}}
    loader.load("{{$key}}");
    // {{end}}

    userdata.prog().setScene(CFG.START.SCENE);
    userdata.prog().setPosition(CFG.START.POSITION[0], CFG.START.POSITION[1], CFG.START.POSITION[2]);
    userdata.prog().setAngle(CFG.START.ANGLE[0], CFG.START.ANGLE[1]);

    // EventListener
    window.addEventListener("focus", (ev) => {
    });
    window.addEventListener("blur", (ev) => {
        gamepad.blur(ev);
        engine.suspend();
    });
    window.addEventListener("resize", (ev) => {
    });
    window.addEventListener("gamepadconnected", (ev) => {
        LOGGING && console.log("gamepadconnected");
        gamepad.gamepadconnected(ev);
    });
    window.addEventListener("gamepaddisconnected", (ev) => {
        LOGGING && console.log("gamepaddisconnected");
        gamepad.gamepaddisconnected(ev);
    });
    document.body.addEventListener("click", (ev) => {
        audio.resume();
        engine.resume();
        if(gamepad.mode() === GAMEPAD_MODE_MOUSE_KEYBOARD) {
            if(document.pointerLockElement !== document.body) {
                LOGGING && console.log("requestPointerLock");
                document.body.requestPointerLock();
            }
        }
    });
    document.addEventListener("pointerlockchange", (ev) => {
        if(document.pointerLockElement === null) {
            if(gamepad.mode() === GAMEPAD_MODE_MOUSE_KEYBOARD) {
                LOGGING && console.log("engine.suspend");
                engine.suspend();
            }
        }
    });
    document.addEventListener("pointerlockerror", (ev) => {
        LOGGING && console.log("pointerlockerror");
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
        gamepad.tick();
        engine.tick();

        engine.begin();
        update.forEach(a => a.begin());
        engine.execute();
        update.forEach(a => a.end());
        engine.end();
        audio.tick();

        graphics.reset();
        draw.forEach(a => a.draw());
        requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
});
