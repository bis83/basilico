
window.addEventListener("load", () => {
    // CoreSystem
    const audio = makeCoreAudio();
    const engine = makeCoreEngine();
    const gamepad = makeCoreGamepad();
    const graphics = makeCoreGraphics();
    const scene = makeCoreScene();
    const userdata = makeCoreUserData();    
    const bundle = makeBundleLoader(graphics, scene);
    const layers = [
        layerMenu(engine, graphics),
        layerPlayer(gamepad, graphics),
        layerDebugGrid(engine, graphics),
        layerProp(graphics, scene),
    ];
    userdata.start();
    bundle.start();

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
        
        bundle.tick();
        userdata.tick();
        audio.tick();

        engine.begin();
        layers.forEach(l => l.begin());
        engine.execute();
        layers.forEach(l => l.end());
        engine.end();

        graphics.reset();
        layers.forEach(l => l.draw());
        requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
});
