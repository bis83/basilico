
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
        $grid.t[i] = {
            base: [],
            no: 0,
            ha: 0,
        };
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
const grid_get = (x, y) => {
    return $grid.t[grid_index(x, y)];
};

const grid_is_empty = (tile) => {
    if(!tile) {
        return true;
    }
    return (tile.base.length <= 0) && (tile.no <= 0);
};

const grid_is_prop = (tile) => {
    if(!tile) {
        return false;
    }
    return (tile.no > 0);
};

const grid_is_noentry = (tile, h0) => {
    if(grid_is_empty(tile)) {
        return true;
    }
    if(grid_is_prop(tile)) {
        return true;
    }
    const h1 = grid_height(tile);
    if(Math.abs(h0-h1) > 1) {
        return true;
    }
    return false;
};

const grid_height = (tile) => {
    if(!tile) {
        return 0;
    }
    return tile.base.length;
};

const grid_set = (tile, no, ha) => {
    if(!tile) {
        return;
    }
    tile.no = no;
    tile.ha = ha || 0;
};
const grid_del = (tile) => {
    if(!tile) {
        return;
    }
    tile.no = 0;
    tile.ha = 0;
};
const grid_base_push = (tile, no) => {
    if(!tile) {
        return;
    }
    tile.base.push(no);
};
const grid_base_pop = (tile) => {
    if(!tile) {
        return;
    }
    tile.base.pop();
};

const grid_encode = (data) => {
    return data;
};
const grid_decode = (data) => {
    return data;
};
