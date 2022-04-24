
var $temp = {
    cam: {
        vp: new Float32Array(16),
        o: new Float32Array(16),
    },
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
};

const temp_stack_init = () => {
    $temp.stack.w = 64;
    $temp.stack.h = 64;
    $temp.stack.a.length = 0;
    $temp.stack.a.length = $temp.stack.w * $temp.stack.h;
    for(let i=0; i<$temp.stack.a.length; ++i) {
        const h = 1 + Math.floor(Math.random() * 10)
        $temp.stack.a[i] = [];
        $temp.stack.a[i].push(stack_set(1, h));
    }

    $temp.pos.x = 0.5;
    $temp.pos.y = 0.5;
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
