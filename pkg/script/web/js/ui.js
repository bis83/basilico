
const UI_STATE_RESET = 0;
const BUTTON_STATE_RELEASED = 0;
const BUTTON_STATE_PRESSED = 1;

const ui_tick_button = (ui, u) => {
    const mode = $listen.mode;
    if(mode === GAMEPAD_MODE_POINTER) {
        ui.value = false;
        ui.state = BUTTON_STATE_RELEASED;
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
            default:
                break;
        }

        const m = mat4scale(u.width/2, u.height/2, 1);
        mat4translated(m, u.offset[0], u.offset[1], 0);
        ui.m.set(m);
    }
};
