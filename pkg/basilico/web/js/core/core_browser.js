
const makeCoreBrowser = () => {
    let gamepad = null;
    let isPointerLocked = false;
    let timestamp = 0;
    let dt = 0;

    const controllers = [];

    window.addEventListener("focus", (ev) => {
    });
    window.addEventListener("blur", (ev) => {
    });
    window.addEventListener("resize", (ev) => {
        LOG("resize");
    });
    window.addEventListener("gamepadconnected", (ev) => {
        LOG("gamepadconnected");
        gamepad = ev.gamepad;
    });
    window.addEventListener("gamepaddisconnected", (ev) => {
        LOG("gamepaddisconnected");
        if(gamepad === ev.gamepad) {
            gamepad = null;
        }
    });
    document.addEventListener("pointerlockchange", (ev) => {
        isPointerLocked = document.pointerLockElement === document.body;
        ev.preventDefault();
    });
    document.body.addEventListener("click", (ev) => {
        ev.preventDefault();
    });
    document.addEventListener("keydown", (ev) => {
        if(!isPointerLocked) {
            return;
        }
        ev.preventDefault();
    });
    document.addEventListener("keyup", (ev) => {
        if(!isPointerLocked) {
            return;
        }
        ev.preventDefault();
    });
    document.body.addEventListener("mousedown", (ev) => {
        if(!isPointerLocked) {
            return;
        }
        ev.preventDefault();
    });
    document.body.addEventListener("mouseup", (ev) => {
        if(!isPointerLocked) {
            return;
        }
        ev.preventDefault();
    });
    document.body.addEventListener("mousemove", (ev) => {
        if(!isPointerLocked) {
            return;
        }
        ev.preventDefault();
    });
    document.body.addEventListener("touchstart", (ev) => {
    });
    document.body.addEventListener("touchmove", (ev) => {
    });
    document.body.addEventListener("touchend", (ev) => {
    });

    const lock = () => {
        if(!isPointerLocked) {
            document.body.requestPointerLock();
        }
    };
    const tick = (t) => {
        {
            dt = t - timestamp;
            timestamp = t;
        }
        if(gamepad) {
            const gamepads = navigator.getGamepads();
            gamepad = gamepads[gamepad.index];
        }
        for(let c of controllers) {
            c();
        }
    }
    const makeController = () => {
        let lx = 0;
        let ly = 0;
        const tick = () => {
        };
        controllers.push(tick);
        return {
            dispose: () => {
                const i = controllers.indexOf();
                if(i >= 0) {
                    controllers.splice(i, 1);
                }
            }
        };
    };

    return {
        lock: lock,
        tick: tick,
        makeController: makeController,
    };
};
