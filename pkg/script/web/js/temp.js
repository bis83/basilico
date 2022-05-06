
var $temp = {
    cam: {
        vp: new Float32Array(16),
        o: new Float32Array(16),
    },
    init: false,
    pos: {
        x: 0,
        y: 0,
        ha: 0,
        va: 0,
        h: 0,
        eyeh: 1.75,
    },
    stack: {
        w: 0,
        h: 0,
        a: [],
    },
    ui: {},
};

const temp_stack = (x, y) => {
    x = Math.floor(x);
    y = Math.floor(y);
    if(x < 0 || $temp.stack.w <= x) {
        return null;
    }
    if(y < 0 || $temp.stack.h <= y) {
        return null;
    }
    return $temp.stack.a[x + y * $temp.stack.h];
};

const temp_stack_height = (x, y) => {
    const stack = temp_stack(x, y);
    if(!stack) {
        return 0;
    }
    let h = 0;
    for(const s of stack) {
        const [id, count] = stack_get(s);
        const data = data_stack(id);
        if(!data) {
            continue;
        }
        h += count * data.height;
    }
    return h;
};

const temp_ui_value = (name) => {
    const ui = $temp.ui[name];
    if(!ui) {
        return null;
    }
    return ui.value;
};
