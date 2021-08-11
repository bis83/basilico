
const makeCoreEngine = () => {
    const reg = new Array(REG_MAX);
    reg[REG_FRAME] = 0;
    reg[REG_WIDTH] = window.innerWidth;
    reg[REG_HEIGHT] = window.innerHeight;
    reg[REG_DELTA_TIME] = 0;
    reg[REG_PROCESS_TIME] = 0;

    reg[REG_GAME_MODE] = GAME_MODE_PAUSE;

    reg[REG_DEVICE_MODE] = DEVICE_MODE_GAMEPAD;
    reg[REG_DEVICE_MOUSE_CHANGED] = false;
    reg[REG_DEVICE_KEYBOARD_CHANGED] = false;
    reg[REG_DEVICE_TOUCH_CHANGED] = false;
    reg[REG_DEVICE_GAMEPAD_CHANGED] = false;

    reg[REG_ACT_MOVE_F] = 0.0;
    reg[REG_ACT_MOVE_S] = 0.0;
    reg[REG_ACT_CAMERA_MOVE_V] = 0.0;
    reg[REG_ACT_CAMERA_MOVE_H] = 0.0;
    reg[REG_ACT_LEFT_HAND] = false;
    reg[REG_ACT_RIGHT_HAND] = false;
    reg[REG_ACT_ACTIVATE] = false;
    reg[REG_POINTER_START_X] = 0;
    reg[REG_POINTER_START_Y] = 0;
    reg[REG_POINTER_END_X] = 0;
    reg[REG_POINTER_END_Y] = 0;
    reg[REG_POINTER_STATE] = POINTER_STATE_FREE;

    reg[REG_REQUEST_RESUME] = false;

    const tickFrameInfo = (time) => {
        reg[REG_FRAME] += 1;
        reg[REG_WIDTH] = window.innerWidth;
        reg[REG_HEIGHT] = window.innerHeight;
        reg[REG_DELTA_TIME] = time - reg[REG_PROCESS_TIME];
        reg[REG_PROCESS_TIME] = time;
    };
    const tickDeviceMode = (browser) => {
        const prevDeviceMode = reg[REG_DEVICE_MODE];
        reg[REG_GAME_MODE] = browser.suspend() ? GAME_MODE_PAUSE : GAME_MODE_ACTIVE;
        reg[REG_DEVICE_MOUSE_CHANGED] = browser.mouseChanged();
        reg[REG_DEVICE_KEYBOARD_CHANGED] = browser.keysChanged();
        reg[REG_DEVICE_TOUCH_CHANGED] = browser.touchChanged();
        reg[REG_DEVICE_GAMEPAD_CHANGED] = browser.gpadChanged();
        if(reg[REG_DEVICE_MOUSE_CHANGED] || reg[REG_DEVICE_KEYBOARD_CHANGED]) {
            reg[REG_DEVICE_MODE] = DEVICE_MODE_MOUSE_KEYBOARD;
        } else if(reg[REG_DEVICE_TOUCH_CHANGED]) {
            reg[REG_DEVICE_MODE] = DEVICE_MODE_TOUCH;
        } else if(reg[REG_DEVICE_GAMEPAD_CHANGED]) {
            reg[REG_DEVICE_MODE] = DEVICE_MODE_GAMEPAD;
        }
        return prevDeviceMode !== reg[REG_DEVICE_MODE];
    };
    const tickPause = (browser) => {
        reg[REG_ACT_MOVE_F] = 0.0;
        reg[REG_ACT_MOVE_S] = 0.0;
        reg[REG_ACT_CAMERA_MOVE_V] = 0.0;
        reg[REG_ACT_CAMERA_MOVE_H] = 0.0;
        reg[REG_ACT_LEFT_HAND] = false;
        reg[REG_ACT_RIGHT_HAND] = false;
        reg[REG_ACT_ACTIVATE] = false;
        if(reg[REG_DEVICE_MODE] === DEVICE_MODE_GAMEPAD) {
            reg[REG_POINTER_START_X] = 0;
            reg[REG_POINTER_START_Y] = 0;
            reg[REG_POINTER_END_X] = 0;
            reg[REG_POINTER_END_Y] = 0;
            reg[REG_POINTER_STATE] = POINTER_STATE_FREE;
        }
        if(reg[REG_DEVICE_MODE] === DEVICE_MODE_MOUSE_KEYBOARD) {
            const keys = browser.keys();
            const mouse = browser.mouse();
            switch(reg[REG_POINTER_STATE]) {
                case POINTER_STATE_FREE:
                    if(mouse.lb) {
                        reg[REG_POINTER_START_X] = mouse.x - reg[REG_WIDTH]/2;
                        reg[REG_POINTER_START_Y] = -(mouse.y - reg[REG_HEIGHT]/2);
                        reg[REG_POINTER_END_X] = reg[REG_POINTER_START_X];
                        reg[REG_POINTER_END_Y] = reg[REG_POINTER_START_Y];
                        reg[REG_POINTER_STATE] = POINTER_STATE_START;
                    }
                    break;
                case POINTER_STATE_START:
                    reg[REG_POINTER_END_X] = mouse.x - reg[REG_WIDTH]/2;
                    reg[REG_POINTER_END_Y] = -(mouse.y - reg[REG_HEIGHT]/2);
                    if(mouse.lb) {
                        reg[REG_POINTER_STATE] = POINTER_STATE_MOVING;
                    } else {
                        reg[REG_POINTER_STATE] = POINTER_STATE_END;
                    }
                    break;
                case POINTER_STATE_MOVING:
                    reg[REG_POINTER_END_X] = mouse.x - reg[REG_WIDTH]/2;
                    reg[REG_POINTER_END_Y] = -(mouse.y - reg[REG_HEIGHT]/2);
                    if(mouse.lb) {
                        reg[REG_POINTER_STATE] = POINTER_STATE_MOVING;
                    } else {
                        reg[REG_POINTER_STATE] = POINTER_STATE_END;
                    }
                    break;
                case POINTER_STATE_END:
                    reg[REG_POINTER_START_X] = 0;
                    reg[REG_POINTER_START_Y] = 0;
                    reg[REG_POINTER_END_X] = 0;
                    reg[REG_POINTER_END_Y] = 0;
                    reg[REG_POINTER_STATE] = POINTER_STATE_FREE;
                    break;
            }
        }
        if(reg[REG_DEVICE_MODE] === DEVICE_MODE_TOUCH) {
            // TODO:
        }
    };
    const tickActive = (browser) => {
        reg[REG_POINTER_START_X] = 0;
        reg[REG_POINTER_START_Y] = 0;
        reg[REG_POINTER_END_X] = 0;
        reg[REG_POINTER_END_Y] = 0;
        reg[REG_POINTER_STATE] = POINTER_STATE_FREE;
        if(reg[REG_DEVICE_MODE] === DEVICE_MODE_GAMEPAD) {
            const gpad = browser.gpad();
            reg[REG_ACT_MOVE_F] = -gpad.ly;
            reg[REG_ACT_MOVE_S] = gpad.lx;
            reg[REG_ACT_CAMERA_MOVE_V] = -gpad.ry;
            reg[REG_ACT_CAMERA_MOVE_H] = gpad.rx;
            reg[REG_ACT_LEFT_HAND] = gpad.lt;
            reg[REG_ACT_RIGHT_HAND] = gpad.rt;
            reg[REG_ACT_ACTIVATE] = gpad.b0;
        }
        if(reg[REG_DEVICE_MODE] === DEVICE_MODE_MOUSE_KEYBOARD) {
            const keys = browser.keys();
            const mouse = browser.mouse();
            reg[REG_ACT_MOVE_F] = (keys.w ? +1.0 : 0.0) + (keys.s ? -1.0 : 0.0);
            reg[REG_ACT_MOVE_S] = (keys.a ? -1.0 : 0.0) + (keys.d ? +1.0 : 0.0);
            reg[REG_ACT_CAMERA_MOVE_V] = -mouse.my;
            reg[REG_ACT_CAMERA_MOVE_H] = mouse.mx;
            reg[REG_ACT_LEFT_HAND] = mouse.lb;
            reg[REG_ACT_RIGHT_HAND] = mouse.rb;
            reg[REG_ACT_ACTIVATE] = keys.space;
        }
        if(reg[REG_DEVICE_MODE] === DEVICE_MODE_TOUCH) {
            // TODO:
        }
    };

    const begin = (time, browser, userdata) => {
        tickFrameInfo(time);
        if(tickDeviceMode(browser)) {
            reg[REG_ACT_MOVE_F] = 0.0;
            reg[REG_ACT_MOVE_S] = 0.0;
            reg[REG_ACT_CAMERA_MOVE_V] = 0.0;
            reg[REG_ACT_CAMERA_MOVE_H] = 0.0;
            reg[REG_ACT_LEFT_HAND] = false;
            reg[REG_ACT_RIGHT_HAND] = false;
            reg[REG_ACT_ACTIVATE] = false;
            reg[REG_POINTER_START_X] = 0;
            reg[REG_POINTER_START_Y] = 0;
            reg[REG_POINTER_END_X] = 0;
            reg[REG_POINTER_END_Y] = 0;
            reg[REG_POINTER_STATE] = POINTER_STATE_FREE;
            LOGGING && console.log("DeviceChanged", reg[REG_DEVICE_MODE]);
        } else {
            if(reg[REG_GAME_MODE] === GAME_MODE_PAUSE) {
                tickPause(browser);
            }
            if(reg[REG_GAME_MODE] === GAME_MODE_ACTIVE) {
                tickActive(browser);
            }
        }
        if(LOGGING) {
            if(reg[REG_ACT_ACTIVATE]) {
                console.log(
                    reg[REG_ACT_MOVE_F],
                    reg[REG_ACT_MOVE_S],
                    reg[REG_ACT_CAMERA_MOVE_V],
                    reg[REG_ACT_CAMERA_MOVE_H],
                    reg[REG_ACT_LEFT_HAND],
                    reg[REG_ACT_RIGHT_HAND],
                    reg[REG_ACT_ACTIVATE]);                    
            }
            if(reg[REG_POINTER_STATE] !== POINTER_STATE_FREE) {
                console.log(
                    reg[REG_POINTER_STATE],
                    reg[REG_POINTER_START_X], reg[REG_POINTER_START_Y],
                    reg[REG_POINTER_END_X], reg[REG_POINTER_END_Y]);
            }
        }
    };
    const execute = () => {
    };
    const end = (browser) => {
        if(reg[REG_REQUEST_RESUME]) {
            browser.resume(reg[REG_DEVICE_MODE] === DEVICE_MODE_MOUSE_KEYBOARD);
            reg[REG_REQUEST_RESUME] = false;
        }
    };
    return {
        begin: begin,
        execute: execute,
        end: end,
        reg: (no) => { return reg[no]; },
        req: (no) => { reg[no] = true; },
    }
};
