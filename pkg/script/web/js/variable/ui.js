
const $ui = {};

const ui_value = (name) => {
    const ui = $ui[name];
    if(!ui) {
        return null;
    }
    return ui.value;
};

const UI_STATE_RESET = 0;
const BUTTON_STATE_RELEASED = 0;
const BUTTON_STATE_PRESSED = 1;

const ui_hit_click = (ui, point) => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const ratio = window.devicePixelRatio;
    const minX = w/2 + (ui.offset[0] - ui.width/2) * ratio;
    const maxX = w/2 + (ui.offset[0] + ui.width/2) * ratio;
    const minY = h/2 + (ui.offset[1] - ui.height/2) * ratio;
    const maxY = h/2 + (ui.offset[1] + ui.height/2) * ratio;
    return xy_hit_rect(point, minX, maxX, minY, maxY);
};

const ui_tick_button = (tui, ui) => {
    const mode = $listen.mode;
    if(mode === GAMEPAD_MODE_POINTER) {
        let hit = false;
        const click = $listen.click;
        for(let c of click) {
            if(ui_hit_click(ui, [c.x, c.y])) {
                hit = true;
                break;
            }
        }
        if(hit) {
            tui.value = true;
            tui.state = BUTTON_STATE_PRESSED;            
        } else {
            tui.value = false;
            tui.state = BUTTON_STATE_RELEASED;
        }
    } else if(mode === GAMEPAD_MODE_GAMEPAD) {
        const gamepad = $listen.gamepad;
        if(gamepad[ui.gamepad]) {
            if(tui.state !== BUTTON_STATE_PRESSED) {
                tui.value = true;
                tui.state = BUTTON_STATE_PRESSED;
            } else {
                tui.value = false;
            }
        } else {
            tui.value = false;
            tui.state = BUTTON_STATE_RELEASED;
        }
    } else if(mode === GAMEPAD_MODE_KEYBOARD) {
        const keyboard = $listen.keyboard;
        if(keyboard[ui.keyboard]) {
            if(tui.state !== BUTTON_STATE_PRESSED) {
                tui.value = true;
                tui.state = BUTTON_STATE_PRESSED;
            } else {
                tui.value = false;
            }
        } else {
            tui.value = false;
            tui.state = BUTTON_STATE_RELEASED;
        }
    }
}

const ui_tick_left_stick = (tui, ui) => {
    const mode = $listen.mode;
    if(mode === GAMEPAD_MODE_POINTER) {
        tui.value = [0, 0];
        for(const touch of $listen.touch.values()) {
            if(ui_hit_click(ui, [touch.sx, touch.sy])) {
                const x = (touch.x - touch.sx);
                const y = -(touch.y - touch.sy);
                tui.value = xy_normalize(x, y);
                break;
            }
        }
    } else if(mode === GAMEPAD_MODE_GAMEPAD) {
        const gamepad = $listen.gamepad;
        tui.value = xy_normalize(gamepad.lx, -gamepad.ly);
    } else if(mode === GAMEPAD_MODE_KEYBOARD) {
        const keyboard = $listen.keyboard;
        const x = keyboard.a ? -1 : keyboard.d ? +1 : 0;
        const y = keyboard.w ? +1 : keyboard.s ? -1 : 0;
        tui.value = xy_normalize(x, y);
    }
}

const ui_tick_right_stick = (tui, ui) => {
    const mode = $listen.mode;
    if(mode === GAMEPAD_MODE_POINTER) {
        tui.value = [0, 0];
        for(const touch of $listen.touch.values()) {
            if(ui_hit_click(ui, [touch.sx, touch.sy])) {
                const x = (touch.x - touch.sx);
                const y = -(touch.y - touch.sy);
                tui.value = xy_normalize(x, y);
                break;
            }
        }
    } else if(mode === GAMEPAD_MODE_GAMEPAD) {
        const gamepad = $listen.gamepad;
        tui.value = xy_normalize(gamepad.rx, -gamepad.ry);
    } else if(mode === GAMEPAD_MODE_KEYBOARD) {
        const keyboard = $listen.keyboard;
        const x = keyboard.right ? +1 : keyboard.left ? -1 : 0;
        const y = keyboard.up ? +1 : keyboard.down ? -1 : 0;
        tui.value = xy_normalize(x, y);
    }
}

const ui_tick = (view) => {
    for(const key in $ui) {
        $ui[key].value = null;
    }
    for(let no of view.ui) {
        const ui = data_ui(no);
        if(!ui) {
            continue;
        }
        if(!$ui[ui.name]) {
            $ui[ui.name] = {
                m: new Float32Array(16),
                value: null,
                state: UI_STATE_RESET,
            };
        }
        const tui = $ui[ui.name];
        
        switch(ui.interact) {
            case 1: // button
                ui_tick_button(tui, ui);
                break;
            case 2: // left-stick
                ui_tick_left_stick(tui, ui);
                break;
            case 3: // right-stick
                ui_tick_right_stick(tui, ui);
                break;
            default:
                break;
        }

        const ratio = window.devicePixelRatio;
        const m = mat4scale(ui.width/2 * ratio, ui.height/2 * ratio, 1);
        mat4translated(m, ui.offset[0] * ratio, -ui.offset[1] * ratio, 0);
        tui.m.set(m);
    }
};
