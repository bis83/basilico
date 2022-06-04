
const $tile = {
    w: 0,
    h: 0,
    a: [],
};

const tile_encode = (data) => {
    return data;
};
const tile_decode = (data) => {
    return data;
};

const tile_value = (x, y) => {
    x = Math.floor(x);
    y = Math.floor(y);
    if(x < 0 || $tile.w <= x) {
        return null;
    }
    if(y < 0 || $tile.h <= y) {
        return null;
    }
    return $tile.a[x + y * $tile.h];
};

const tile_height = (x, y) => {
    const tile = tile_value(x, y);
    if(!tile) {
        return 0;
    }
    let h = 0;
    for(const s of tile) {
        const data = data_tile(s.no);
        if(!data) {
            continue;
        }
        h += s.count * data.height;
    }
    return h;
};

const tile_is_empty = (x, y) => {
    const tile = tile_value(x, y);
    if(!tile) {
        return true;
    }
    return tile.length === 0;
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
