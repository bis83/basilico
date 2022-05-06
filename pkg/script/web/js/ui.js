
const UI_STATE_RESET = 0;
const BUTTON_STATE_RELEASED = 0;
const BUTTON_STATE_PRESSED = 1;

const ui_hit_click = (u, point) => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const minX = w/2 + u.offset[0] - u.width/2;
    const maxX = w/2 + u.offset[0] + u.width/2;
    const minY = h/2 + u.offset[1] - u.height/2;
    const maxY = h/2 + u.offset[1] + u.height/2;
    return xy_hit_rect(point, minX, maxX, minY, maxY);
};

const ui_tick_button = (ui, u) => {
    const mode = $listen.mode;
    if(mode === GAMEPAD_MODE_POINTER) {
        let hit = false;
        const click = $listen.click;
        for(let c of click) {
            if(ui_hit_click(u, [c.x, c.y])) {
                hit = true;
                break;
            }
        }
        if(hit) {
            ui.value = true;
            ui.state = BUTTON_STATE_PRESSED;            
        } else {
            ui.value = false;
            ui.state = BUTTON_STATE_RELEASED;
        }
    } else if(mode === GAMEPAD_MODE_GAMEPAD) {
        const gamepad = $listen.gamepad;
        if(gamepad[u.gamepad]) {
            if(ui.state !== BUTTON_STATE_PRESSED) {
                ui.value = true;
                ui.state = BUTTON_STATE_PRESSED;
            } else {
                ui.value = false;
            }
        } else {
            ui.value = false;
            ui.state = BUTTON_STATE_RELEASED;
        }
    } else if(mode === GAMEPAD_MODE_KEYBOARD) {
        const keyboard = $listen.keyboard;
        if(keyboard[u.keyboard]) {
            if(ui.state !== BUTTON_STATE_PRESSED) {
                ui.value = true;
                ui.state = BUTTON_STATE_PRESSED;
            } else {
                ui.value = false;
            }
        } else {
            ui.value = false;
            ui.state = BUTTON_STATE_RELEASED;
        }
    }
}

const ui_tick_left_stick = (ui, u) => {
    const mode = $listen.mode;
    if(mode === GAMEPAD_MODE_POINTER) {
        ui.value = [0, 0];
        for(const touch of $listen.touch.values()) {
            if(ui_hit_click(u, [touch.sx, touch.sy])) {
                const x = (touch.x - touch.sx);
                const y = -(touch.y - touch.sy);
                ui.value = xy_normalize(x, y);
                break;
            }
        }
    } else if(mode === GAMEPAD_MODE_GAMEPAD) {
        const gamepad = $listen.gamepad;
        ui.value = xy_normalize(gamepad.lx, -gamepad.ly);
    } else if(mode === GAMEPAD_MODE_KEYBOARD) {
        const keyboard = $listen.keyboard;
        const x = keyboard.a ? -1 : keyboard.d ? +1 : 0;
        const y = keyboard.w ? +1 : keyboard.s ? -1 : 0;
        ui.value = xy_normalize(x, y);
    }
}

const ui_tick_right_stick = (ui, u) => {
    const mode = $listen.mode;
    if(mode === GAMEPAD_MODE_POINTER) {
        ui.value = [0, 0];
        for(const touch of $listen.touch.values()) {
            if(ui_hit_click(u, [touch.sx, touch.sy])) {
                const x = (touch.x - touch.sx);
                const y = -(touch.y - touch.sy);
                ui.value = xy_normalize(x, y);
                break;
            }
        }
    } else if(mode === GAMEPAD_MODE_GAMEPAD) {
        const gamepad = $listen.gamepad;
        ui.value = xy_normalize(gamepad.rx, -gamepad.ry);
    } else if(mode === GAMEPAD_MODE_KEYBOARD) {
        const keyboard = $listen.keyboard;
        const x = keyboard.right ? +1 : keyboard.left ? -1 : 0;
        const y = keyboard.up ? +1 : keyboard.down ? -1 : 0;
        ui.value = xy_normalize(x, y);
    }
}

const ui_tick = () => {
    const data = data_ui()
    if(!data) {
        return;
    }
    for(let u of data) {
        if(!$temp.ui[u.name]) {
            $temp.ui[u.name] = {
                m: new Float32Array(16),
                value: null,
                state: UI_STATE_RESET,
            };
        }
        const ui = $temp.ui[u.name];

        switch(u.interact) {
            case 1: // button
                ui_tick_button(ui, u);
                break;
            case 2: // left-stick
                ui_tick_left_stick(ui, u);
                break;
            case 3: // right-stick
                ui_tick_right_stick(ui, u);
                break;
            default:
                break;
        }

        const m = mat4scale(u.width/2, u.height/2, 1);
        mat4translated(m, u.offset[0], -u.offset[1], 0);
        ui.m.set(m);
    }
};
