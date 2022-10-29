
const STATE_RESET = 0;
const BUTTON_STATE_RELEASED = 0;
const BUTTON_STATE_PRESSED = 1;

const com_make = () => {
    return {
        m: new Float32Array(16),
        rect: [0, 0, 0, 0],
        value: null,
        state: STATE_RESET,
        img: null,
        cvs: null,
    };
};

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

const com_matrix = (data, w, h) => {
    const ox = data.rect.ox * w/2;
    const oy = data.rect.oy * h/2;
    const m = mat4scale(data.rect.w/2, data.rect.h/2, 1);
    mat4translated(m, ox + data.rect.x, -(oy + data.rect.y), 0);
    return m;
};

const com_rect = (data, w, h) => {
    const ox = w/2 + (w/2 * data.rect.ox);
    const oy = h/2 + (h/2 * data.rect.oy);
    const minX = ox + (data.rect.x - data.rect.w/2);
    const maxX = ox + (data.rect.x + data.rect.w/2);
    const minY = oy + (data.rect.y - data.rect.h/2);
    const maxY = oy + (data.rect.y + data.rect.h/2);
    return [minX, maxX, minY, maxY];
};

com_tick = (com, data) => {
    if(data.rect) {
        com.m.set(com_matrix(data, $view.w, $view.h));
        com.rect = com_rect(data, $view.w, $view.h);
    }
    if(data.text) {
        if(com.img === null) {
            com.cvs = cvs_create(data.rect.w, data.rect.h);
            cvs_text(com.cvs, data.text.contents);
            com.img = gl_createGLTexture2D(com.cvs, data.text.s);
        }
    }
    if(data.touch) {
        com.value = listen_touch(com.rect, data.touch.keyboard, data.touch.gamepad);
        let press = false;
        if(com.value !== null) {
            if(com.state !== BUTTON_STATE_PRESSED) {
                com.state = BUTTON_STATE_PRESSED;
                press = true;
            }
        } else {
            com.state = BUTTON_STATE_RELEASED;
        }
        if(press) {
            action_invoke(com, data.touch.action);
        }
    }
    if(data.tick) {
        action_invoke(com, data.tick.action);
    }
};