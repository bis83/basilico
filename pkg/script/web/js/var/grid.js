
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
