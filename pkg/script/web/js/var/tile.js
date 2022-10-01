
const $tile = {
    w: 0,
    h: 0,
    t: [],
};

const tile_init_empty = (w, h) => {
    w = w || 0;
    h = h || 0;

    $tile.w = w;
    $tile.h = h;
    $tile.t = [];
    $tile.t.length = w*h;
    for(let i=0; i<$tile.t.length; ++i) {
        $tile.t[i] = {
            base: [],
            no: 0,
            ha: 0,
        };
    }
};

const tile_index = (x, y) => {
    x = Math.floor(x);
    y = Math.floor(y);
    if(x < 0 || $tile.w <= x) {
        return -1;
    }
    if(y < 0 || $tile.h <= y) {
        return -1;
    }
    return x + y * $tile.h;
};
const tile_get = (x, y) => {
    return $tile.t[tile_index(x, y)];
};

const tile_is_empty = (tile) => {
    if(!tile) {
        return true;
    }
    return (tile.base.length <= 0) && (tile.no <= 0);
};

const tile_is_prop = (tile) => {
    if(!tile) {
        return false;
    }
    return (tile.no > 0);
};

const tile_is_noentry = (tile, h0) => {
    if(tile_is_empty(tile)) {
        return true;
    }
    if(tile_is_prop(tile)) {
        return true;
    }
    const h1 = tile_height(tile);
    if(Math.abs(h0-h1) > 1) {
        return true;
    }
    return false;
};

const tile_height = (tile) => {
    if(!tile) {
        return 0;
    }
    return tile.base.length;
};

const tile_set = (tile, no, ha) => {
    if(!tile) {
        return;
    }
    tile.no = no;
    tile.ha = ha || 0;
};
const tile_del = (tile) => {
    if(!tile) {
        return;
    }
    tile.no = 0;
    tile.ha = 0;
};
const tile_base_push = (tile, no) => {
    if(!tile) {
        return;
    }
    tile.base.push(no);
};
const tile_base_pop = (tile) => {
    if(!tile) {
        return;
    }
    tile.base.pop();
};

const tile_encode = (data) => {
    return data;
};
const tile_decode = (data) => {
    return data;
};
