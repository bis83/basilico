
const $tile = {
    w: 0,
    h: 0,
    a: [],
    b: [],
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
const tile_base = (x, y) => {
    return $tile.a[tile_index(x, y)];
};
const tile_prop = (x, y) => {
    return $tile.b[tile_index(x, y)];
};

const tile_base_height = (x, y) => {
    const tile = tile_base(x, y);
    if(!tile) {
        return 0;
    }
    const data = data_tile(tile.no);
    if(!data) {
        return 0;
    }
    return data.height * tile.count;
};
const tile_prop_height = (x, y) => {
    const tile = tile_prop(x, y);
    if(!tile) {
        return 0;
    }
    const data = data_tile(tile.no);
    if(!data) {
        return 0;
    }
    return data.height;
};
const tile_height = (x, y) => {
    return tile_base_height(x, y) + tile_prop_height(x, y);
};

const tile_is_empty = (x, y) => {
    return tile_base(x, y) == null;
}

const tile_is_noentry = (x, y, dx, dy) => {
    if(tile_is_empty(x+dx, y+dy)) {
        return true;
    }
    const h0 = tile_height(x, y);
    const h1 = tile_height(x+dx, y+dy);
    if(Math.abs(h0-h1) > 1) {
        return true;
    }
    return false;
};

const tile_init_empty = (w, h) => {
    w = w || 0;
    h = h || 0;

    $tile.w = w;
    $tile.h = h;
    $tile.a = [];
    $tile.a.length = w*h;
    $tile.b = [];
    $tile.b.length = w*h;
};

const tile_base_set = (x, y, no) => {
    const i = tile_index(x, y);
    if(i < 0) {
        return;
    }
    $tile.a[i] = {no: no, count: 1};
};
const tile_prop_set = (x, y, no) => {
    const i = tile_index(x, y);
    if(i < 0) {
        return;
    }
    $tile.b[i] = {no: no, dir: 0};
};

const tile_base_del = (x, y) => {
    const i = tile_index(x, y);
    if(i < 0) {
        return;
    }
    $tile.a[i] = null;
};
const tile_prop_del = (x, y) => {
    const i = tile_index(x, y);
    if(i < 0) {
        return;
    }
    $tile.b[i] = null;
};

const tile_encode = (data) => {
    return data;
};
const tile_decode = (data) => {
    return data;
};

const tile_ranges = (x, y, ha) => {
    let ranges = [];

    const h = deg2rad(ha);
    x += Math.cos(h) * 0.8;
    y += Math.sin(h) * 0.8;
    x = Math.floor(x);
    y = Math.floor(y);
    ranges.push({x: x, y: y});

    return ranges;
};
