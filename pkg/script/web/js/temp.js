
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
    world: {
        w: 0,
        h: 0,
        s: [],
    },
};

const temp_world_init = () => {
    $temp.world.w = 64;
    $temp.world.h = 64;
    $temp.world.s.length = 0;
    $temp.world.s.length = $temp.world.w * $temp.world.h;
    for(let i=0; i<$temp.world.s.length; ++i) {
        const h = 1 + Math.floor(Math.random() * 10)
        $temp.world.s[i] = [];
        $temp.world.s[i].push(stack_set(1, h));
    }

    // $temp.pos.x = $temp.world.w/2;
    // $temp.pos.y = $temp.world.h/2;
    $temp.pos.x = 0.5;
    $temp.pos.y = 0.5;
};

const temp_world_stack = (x, y) => {
    x = Math.floor(x);
    y = Math.floor(y);
    if(x < 0 || $temp.world.w <= x) {
        return null;
    }
    if(y < 0 || $temp.world.h <= y) {
        return null;
    }
    return $temp.world.s[x + y * $temp.world.h];
};

const temp_world_height = (x, y) => {
    const stack = temp_world_stack(x, y);
    if(!stack) {
        return 0;
    }
    let h = 0;
    for(const s of stack) {
        const [id, count] = stack_get(s);
        h += count;
    }
    return h;
};
