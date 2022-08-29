
const $co = [];

const co_value = (name) => {
    const no = data_component_index(name);
    if(no < 0) {
        return null;
    }
    const co = $co[no];
    if(!co) {
        return null;
    }
    return co.value;
};

const STATE_RESET = 0;
const BUTTON_STATE_RELEASED = 0;
const BUTTON_STATE_PRESSED = 1;

const co_hit_click = (data, point) => {
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

const co_button = (co, data) => {
    const mode = $listen.mode;
    if(mode === GAMEPAD_MODE_POINTER) {
        let hit = false;
        const click = $listen.click;
        for(let c of click) {
            if(co_hit_click(data, [c.x, c.y])) {
                hit = true;
                break;
            }
        }
        if(hit) {
            co.value = true;
            co.state = BUTTON_STATE_PRESSED;            
        } else {
            co.value = false;
            co.state = BUTTON_STATE_RELEASED;
        }
    } else if(mode === GAMEPAD_MODE_GAMEPAD) {
        const gamepad = $listen.gamepad;
        if(gamepad[data.gamepad]) {
            if(co.state !== BUTTON_STATE_PRESSED) {
                co.value = true;
                co.state = BUTTON_STATE_PRESSED;
            } else {
                co.value = false;
            }
        } else {
            co.value = false;
            co.state = BUTTON_STATE_RELEASED;
        }
    } else if(mode === GAMEPAD_MODE_KEYBOARD) {
        const keyboard = $listen.keyboard;
        if(keyboard[data.keyboard]) {
            if(co.state !== BUTTON_STATE_PRESSED) {
                co.value = true;
                co.state = BUTTON_STATE_PRESSED;
            } else {
                co.value = false;
            }
        } else {
            co.value = false;
            co.state = BUTTON_STATE_RELEASED;
        }
    }
}

const co_left_stick = (co, data) => {
    const mode = $listen.mode;
    if(mode === GAMEPAD_MODE_POINTER) {
        co.value = [0, 0];
        for(const touch of $listen.touch.values()) {
            if(co_hit_click(data, [touch.sx, touch.sy])) {
                const x = (touch.x - touch.sx);
                const y = -(touch.y - touch.sy);
                co.value = xy_normalize(x, y);
                break;
            }
        }
    } else if(mode === GAMEPAD_MODE_GAMEPAD) {
        const gamepad = $listen.gamepad;
        co.value = xy_normalize(gamepad.lx, -gamepad.ly);
    } else if(mode === GAMEPAD_MODE_KEYBOARD) {
        const keyboard = $listen.keyboard;
        const x = keyboard.a ? -1 : keyboard.d ? +1 : 0;
        const y = keyboard.w ? +1 : keyboard.s ? -1 : 0;
        co.value = xy_normalize(x, y);
    }
}

const co_right_stick = (co, data) => {
    const mode = $listen.mode;
    if(mode === GAMEPAD_MODE_POINTER) {
        co.value = [0, 0];
        for(const touch of $listen.touch.values()) {
            if(co_hit_click(data, [touch.sx, touch.sy])) {
                const x = (touch.x - touch.sx);
                const y = -(touch.y - touch.sy);
                co.value = xy_normalize(x, y);
                break;
            }
        }
    } else if(mode === GAMEPAD_MODE_GAMEPAD) {
        const gamepad = $listen.gamepad;
        co.value = xy_normalize(gamepad.rx, -gamepad.ry);
    } else if(mode === GAMEPAD_MODE_KEYBOARD) {
        const keyboard = $listen.keyboard;
        const x = keyboard.right ? +1 : keyboard.left ? -1 : 0;
        const y = keyboard.up ? +1 : keyboard.down ? -1 : 0;
        co.value = xy_normalize(x, y);
    }
}

const component_tick = (view) => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    
    for(const co of $co) {
        if(co) {
            co.value = null;
        }
    }
    for(let no of view.component) {
        const data = data_component(no);
        if(!data) {
            continue;
        }
        if(!$co[no]) {
            $co[no] = {
                m: new Float32Array(16),
                value: null,
                state: STATE_RESET,
            };
        }

        const co = $co[no];
        switch(data.interact) {
            case 1: // always
                co.value = true;
                break;
            case 2: // button
                co_button(co, data);
                break;
            case 3: // left-stick
                co_left_stick(co, data);
                break;
            case 4: // right-stick
                co_right_stick(co, data);
                break;
            default:
                break;
        }
        if(co.value && data.action) {
            action_invoke(data.action);
        }

        if(data.draw >= 0) {
            const ratio = window.devicePixelRatio;
            const ox = data.ox * w/2;
            const oy = data.oy * h/2;
            const m = mat4scale(data.w/2 * ratio, data.h/2 * ratio, 1);
            mat4translated(m, ox + (data.x * ratio), -(oy + (data.y * ratio)), 0);
            co.m.set(m);
        }
    }
};
