
const $stack = {
    w: 0,
    h: 0,
    a: [],
};

const stack_set = (id, count) => {
    return (id << 0) | (count << 16);
};

const stack_get = (value) => {
    return [
        (value >> 0) & 0xFFFF,
        (value >> 16) & 0xFFFF
    ];
};

const stack_value = (x, y) => {
    x = Math.floor(x);
    y = Math.floor(y);
    if(x < 0 || $stack.w <= x) {
        return null;
    }
    if(y < 0 || $stack.h <= y) {
        return null;
    }
    return $stack.a[x + y * $stack.h];
};

const stack_height = (x, y) => {
    const stack = stack_value(x, y);
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

const stack_is_noentry = (x, y, dx, dy) => {
    const h0 = stack_height(x, y);
    const h1 = stack_height(x+dx, y+dy);
    if(Math.abs(h0-h1) > 1) {
        return true;
    }
    return false;
};
