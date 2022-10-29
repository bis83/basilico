
const $grid = {
    w: 0,
    h: 0,
    t: [],
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

const grid_encode = (data) => {
    return data;
};
const grid_decode = (data) => {
    return data;
};
