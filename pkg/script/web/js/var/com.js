
const $com = [];

const com_value = (name) => {
    const no = data_com_index(name);
    if(no < 0) {
        return null;
    }
    const com = $com[no];
    if(!com) {
        return null;
    }
    return com.value;
};

const STATE_RESET = 0;
const BUTTON_STATE_RELEASED = 0;
const BUTTON_STATE_PRESSED = 1;

const com_hit_click = (data, point) => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const ratio = window.devicePixelRatio;
    const ox = w/2 + (w/2 * data.ox);
    const oy = h/2 + (h/2 * data.oy);
    const minX = ox + (data.x - data.w/2) * ratio;
    const maxX = ox + (data.x + data.w/2) * ratio;
    const minY = oy + (data.y - data.h/2) * ratio;
    const maxY = oy + (data.y + data.h/2) * ratio;
    return xy_hit_rect(point, minX, maxX, minY, maxY);
};

const com_button = (com, data) => {
    const mode = $listen.mode;
    if(mode === GAMEPAD_MODE_POINTER) {
        let hit = false;
        const click = $listen.click;
        for(let c of click) {
            if(com_hit_click(data, [c.x, c.y])) {
                hit = true;
                break;
            }
        }
        if(hit) {
            com.value = true;
            com.state = BUTTON_STATE_PRESSED;            
        } else {
            com.value = false;
            com.state = BUTTON_STATE_RELEASED;
        }
    } else if(mode === GAMEPAD_MODE_GAMEPAD) {
        const gamepad = $listen.gamepad;
        if(gamepad[data.gamepad]) {
            if(com.state !== BUTTON_STATE_PRESSED) {
                com.value = true;
                com.state = BUTTON_STATE_PRESSED;
            } else {
                com.value = false;
            }
        } else {
            com.value = false;
            com.state = BUTTON_STATE_RELEASED;
        }
    } else if(mode === GAMEPAD_MODE_KEYBOARD) {
        const keyboard = $listen.keyboard;
        if(keyboard[data.keyboard]) {
            if(com.state !== BUTTON_STATE_PRESSED) {
                com.value = true;
                com.state = BUTTON_STATE_PRESSED;
            } else {
                com.value = false;
            }
        } else {
            com.value = false;
            com.state = BUTTON_STATE_RELEASED;
        }
    }
}

const com_left_stick = (com, data) => {
    const mode = $listen.mode;
    if(mode === GAMEPAD_MODE_POINTER) {
        com.value = [0, 0];
        for(const touch of $listen.touch.values()) {
            if(com_hit_click(data, [touch.sx, touch.sy])) {
                const x = (touch.x - touch.sx);
                const y = -(touch.y - touch.sy);
                com.value = xy_normalize(x, y);
                break;
            }
        }
    } else if(mode === GAMEPAD_MODE_GAMEPAD) {
        const gamepad = $listen.gamepad;
        com.value = xy_normalize(gamepad.lx, -gamepad.ly);
    } else if(mode === GAMEPAD_MODE_KEYBOARD) {
        const keyboard = $listen.keyboard;
        const x = keyboard.a ? -1 : keyboard.d ? +1 : 0;
        const y = keyboard.w ? +1 : keyboard.s ? -1 : 0;
        com.value = xy_normalize(x, y);
    }
}

const com_right_stick = (com, data) => {
    const mode = $listen.mode;
    if(mode === GAMEPAD_MODE_POINTER) {
        com.value = [0, 0];
        for(const touch of $listen.touch.values()) {
            if(com_hit_click(data, [touch.sx, touch.sy])) {
                const x = (touch.x - touch.sx);
                const y = -(touch.y - touch.sy);
                com.value = xy_normalize(x, y);
                break;
            }
        }
    } else if(mode === GAMEPAD_MODE_GAMEPAD) {
        const gamepad = $listen.gamepad;
        com.value = xy_normalize(gamepad.rx, -gamepad.ry);
    } else if(mode === GAMEPAD_MODE_KEYBOARD) {
        const keyboard = $listen.keyboard;
        const x = keyboard.right ? +1 : keyboard.left ? -1 : 0;
        const y = keyboard.up ? +1 : keyboard.down ? -1 : 0;
        com.value = xy_normalize(x, y);
    }
}

const com_tick = (view) => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    
    for(const com of $com) {
        if(com) {
            com.value = null;
        }
    }
    for(let no of view.com) {
        const data = data_com(no);
        if(!data) {
            continue;
        }
        if(!$com[no]) {
            $com[no] = {
                m: new Float32Array(16),
                value: null,
                state: STATE_RESET,
                img: null,
                cvs: null,
            };
        }
        const com = $com[no];

        if(data.draw >= 0) {
            const ratio = window.devicePixelRatio;
            const ox = data.ox * w/2;
            const oy = data.oy * h/2;
            const m = mat4scale(data.w/2 * ratio, data.h/2 * ratio, 1);
            mat4translated(m, ox + (data.x * ratio), -(oy + (data.y * ratio)), 0);
            com.m.set(m);
        }
        if(data.text) {
            if(com.img === null) {
                com.cvs = cvs_create(data.w, data.h);
                cvs_text(com.cvs, data.text.contents);
                com.img = gl_createGLTexture2D(com.cvs, data.text.s);
            }
        }

        switch(data.interact) {
            case 1: // always
                com.value = true;
                break;
            case 2: // button
                com_button(com, data);
                break;
            case 3: // left-stick
                com_left_stick(com, data);
                break;
            case 4: // right-stick
                com_right_stick(com, data);
                break;
            default:
                break;
        }
        if(com.value && data.action) {
            action_invoke(com, data.action);
        }
    }
};
