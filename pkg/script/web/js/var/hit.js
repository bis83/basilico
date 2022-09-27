
const hit_ranges = (x, y, ha) => {
    let ranges = [];

    const h = deg2rad(ha);
    x += Math.cos(h) * 0.8;
    y += Math.sin(h) * 0.8;
    x = Math.floor(x);
    y = Math.floor(y);
    ranges.push({x: x, y: y});

    return ranges;
};

const HIT_ACTIVATE = 1;
const HIT_MINING = 2;
const HIT_DIG = 3;
const HIT_TILE_SET = 4;

const hit_activate = (ranges) => {
    let result = 0;
    for(const r of ranges) {
        const tile = tile_prop(r.x, r.y);
        if(!tile) {
            continue;
        }
        const data = data_tile(tile.no);
        if(!data) {
            continue;
        }
        if(data.device) {
            action_invoke(tile, data.device.action);
            result += 1;
        }
    }
    return result;
}

const hit_mining = (ranges) => {
    let result = 0;
    for(const r of ranges) {
        const tile = tile_prop(r.x, r.y);
        if(!tile) {
            continue;
        }
        const data = data_tile(tile.no);
        if(!data) {
            continue;
        }
        if(data.mine) {
            item_gain(data.mine.item, data.mine.count);
            tile_prop_del(r.x, r.y);
            result += 1;
        }
    }
    return result;
};

const hit_dig = (ranges) => {
    let result = 0;
    for(const r of ranges) {
        if(tile_prop(r.x, r.y) != null) {
            continue;
        }
        tile_base_del(r.x, r.y);
        result += 1;
    }
    return result;
}

const hit_tile_set = (value, ranges) => {
    let result = 0;
    for(const r of ranges) {
        if(tile_prop(r.x, r.y) != null) {
            continue;
        }
        tile_base_set(r.x, r.y, value);
        result += 1;
    }
    return result;
};

const hit = (hit, value, ranges) => {
    if(hit === HIT_ACTIVATE) {
        return hit_activate(ranges);
    }
    if(hit === HIT_MINING) {
        return hit_mining(ranges);
    }
    if(hit === HIT_DIG) {
        return hit_dig(ranges);
    }
    if(hit === HIT_TILE_SET) {
        return hit_tile_set(value, ranges);
    }
    return 0;
};
