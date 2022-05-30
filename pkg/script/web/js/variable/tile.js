
const $tile = {
    w: 0,
    h: 0,
    a: [],
};

const tile_set = (id, count) => {
    return (id << 0) | (count << 16);
};

const tile_get = (value) => {
    return [
        (value >> 0) & 0xFFFF,
        (value >> 16) & 0xFFFF
    ];
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
        const [id, count] = tile_get(s);
        const data = data_tile(id);
        if(!data) {
            continue;
        }
        h += count * data.height;
    }
    return h;
};

const tile_is_noentry = (x, y, dx, dy) => {
    const h0 = tile_height(x, y);
    const h1 = tile_height(x+dx, y+dy);
    if(Math.abs(h0-h1) > 1) {
        return true;
    }
    return false;
};
