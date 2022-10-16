
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

const grid_is_empty = (grid) => {
    if(!grid) {
        return true;
    }
    return (grid.base.length <= 0) && (grid.no <= 0);
};

const grid_is_tile = (grid) => {
    if(!grid) {
        return false;
    }
    return (grid.no > 0);
};

const grid_is_noentry = (grid, h0) => {
    if(grid_is_empty(grid)) {
        return true;
    }
    if(grid_is_tile(grid)) {
        return true;
    }
    const h1 = grid_height(grid);
    if(Math.abs(h0-h1) > 1) {
        return true;
    }
    return false;
};

const grid_height = (grid) => {
    if(!grid) {
        return 0;
    }
    return grid.base.length;
};

const grid_set = (grid, no, ha) => {
    if(!grid) {
        return;
    }
    grid.no = no;
    grid.ha = ha || 0;
};
const grid_del = (grid) => {
    if(!grid) {
        return;
    }
    grid.no = 0;
    grid.ha = 0;
};
const grid_base_push = (grid, no) => {
    if(!grid) {
        return;
    }
    grid.base.push(no);
};
const grid_base_pop = (grid) => {
    if(!grid) {
        return;
    }
    grid.base.pop();
};

const grid_encode = (data) => {
    return data;
};
const grid_decode = (data) => {
    return data;
};
