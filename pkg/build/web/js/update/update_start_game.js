
const updateStartGame = ({ bundle, save, gamepad }) => {
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

    bundle.load("core");

    save.action.scene(CFG.START.SCENE);
    save.action.position(CFG.START.POSITION[0], CFG.START.POSITION[1], CFG.START.POSITION[2]);
    save.action.angle(CFG.START.ANGLE[0], CFG.START.ANGLE[1]);

    // listen
    listen(window, "focus", (ev) => {
    });
    listen(window, "blur", (ev) => {
        gamepad.action.blur(ev);
    });
    listen(window, "resize", (ev) => {
    });
    listen(window, "gamepadconnected", (ev) => {
        gamepad.action.gamepadconnected(ev);
    });
    listen(window, "gamepaddisconnected", (ev) => {
        gamepad.action.gamepaddisconnected(ev);
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
        gamepad.action.keydown(ev);
    });
    listen(document, "keyup", (ev) => {
        gamepad.action.keyup(ev);
    });
    listen(document.body, "click", (ev) => {
        if(gamepad.mode() === GAMEPAD_MODE_MOUSE_KEYBOARD) {
            if(document.pointerLockElement !== document.body) {
                document.body.requestPointerLock();
            }
        }
    });
    listen(document.body, "mousedown", (ev) => {
        gamepad.action.mousedown(ev);
    });
    listen(document.body, "mouseup", (ev) => {
        gamepad.action.mouseup(ev);
    });
    listen(document.body, "mousemove", (ev) => {
        gamepad.action.mousemove(ev);
    });
    listen(document.body, "touchstart", (ev) => {
        gamepad.action.touchstart(ev);
    });
    listen(document.body, "touchmove", (ev) => {
        gamepad.action.touchmove(ev);
    });
    listen(document.body, "touchend", (ev) => {
        gamepad.action.touchend(ev);
    });
};
