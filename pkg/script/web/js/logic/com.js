
const com_value = (name) => {
    const no = data_com_index(name);
    if(no <= 0) {
        return null;
    }
    const com = $view.com[no];
    if(!com) {
        return null;
    }
    return com.value;
};

const STATE_RESET = 0;
const BUTTON_STATE_RELEASED = 0;
const BUTTON_STATE_PRESSED = 1;

const com_rect = (data) => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const ox = w/2 + (w/2 * data.ox);
    const oy = h/2 + (h/2 * data.oy);
    const minX = ox + (data.x - data.w/2);
    const maxX = ox + (data.x + data.w/2);
    const minY = oy + (data.y - data.h/2);
    const maxY = oy + (data.y + data.h/2);
    return [minX, maxX, minY, maxY];
};

const com_button = (com, data) => {
    const rect = com_rect(data);
    const touch = listen_touch(rect, data.keyboard, data.gamepad);
    if(touch !== null) {
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

const com_left_stick = (com, data) => {
    const rect = com_rect(data);
    const touch = listen_touch(rect, "wasd", "left-stick");
    com.value = touch || [0, 0];
}

const com_right_stick = (com, data) => {
    const rect = com_rect(data);
    const touch = listen_touch(rect, "arrow", "right-stick");
    com.value = touch || [0, 0];
}

const com_tick = (view) => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    
    for(const com of $view.com) {
        if(com) {
            com.value = null;
        }
    }
    
    if(!view.com) {
        return;
    }
    for(let no of view.com) {
        const data = data_com(no);
        if(!data) {
            continue;
        }
        if(!$view.com[no]) {
            $view.com[no] = {
                m: new Float32Array(16),
                value: null,
                state: STATE_RESET,
                img: null,
                cvs: null,
            };
        }
        const com = $view.com[no];

        if(data.draw > 0) {
            const ox = data.ox * w/2;
            const oy = data.oy * h/2;
            const m = mat4scale(data.w/2, data.h/2, 1);
            mat4translated(m, ox + data.x, -(oy + data.y), 0);
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
