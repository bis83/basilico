
const $grid = {
    w: 0,
    h: 0,
    t: [],
    m: [],
};

const grid_init_empty = (w, h) => {
    w = w || 0;
    h = h || 0;

    $grid.w = w;
    $grid.h = h;
    $grid.t = [];
    $grid.t.length = w*h;
    for(let i=0; i<$grid.t.length; ++i) {
        $grid.t[i] = tile_make();
    }
    $grid.m = [];
};

const grid_load = (no) => {
    const data = data_grid(no);
    if(!data) {
        return;
    }
    grid_init_empty(data.w, data.h);
    if(data.b) {
        for(const a of data.b) {
            for(let x = a.x; x < a.x + a.w; ++x) {
                for(let y = a.y; y < a.y + a.h; ++y) {
                    tile_base_push(grid_tile(x, y), a.no);
                }
            }
        }
    }
    if(data.t) {
        for(const a of data.t) {
            tile_set(grid_tile(a.x, a.y), a.no, a.ha);
        }
    }
    if(data.m) {
        for(const a of data.m) {
            grid_add_mob(a.no, a.x+0.5, a.y+0.5, a.ha);
        }
    }
};

const grid_index = (x, y) => {
    x = Math.floor(x);
    y = Math.floor(y);
    if(x < 0 || $grid.w <= x) {
        return -1;
    }
    if(y < 0 || $grid.h <= y) {
        return -1;
    }
    return x + y * $grid.h;
};

const grid_tile = (x, y) => {
    return $grid.t[grid_index(x, y)];
};
const grid_mob = (no) => {
    return $grid.m.find(o => o.no === no);
};

const grid_add_mob = (no, x, y, ha) => {
    const h = tile_height(grid_tile(x, y));
    $grid.m.push(mob_make(no, x, y, h, ha, 0));
};

const grid_tick = () => {
    for(const mob of $grid.m) {
        mob_tick(mob);
    }
};

const grid_encode = (data) => {
    return data;
};
const grid_decode = (data) => {
    return data;
};
