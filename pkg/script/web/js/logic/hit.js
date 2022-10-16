
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
const HIT_PUT = 4;

const hit_activate = (ranges) => {
    let result = 0;
    for(const r of ranges) {
        const grid = grid_get(r.x, r.y);
        if(!grid) {
            continue;
        }
        const data = data_tile(grid.no);
        if(!data) {
            continue;
        }
        if(data.device) {
            action_invoke(grid, data.device.action);
            result += 1;
        }
    }
    return result;
}

const hit_mining = (ranges) => {
    let result = 0;
    for(const r of ranges) {
        const grid = grid_get(r.x, r.y);
        if(!grid) {
            continue;
        }
        const data = data_tile(grid.no);
        if(!data) {
            continue;
        }
        if(data.mine) {
            item_gain(data.mine.item, data.mine.count);
            grid_del(grid);
            result += 1;
        }
    }
    return result;
};

const hit_dig = (ranges) => {
    let result = 0;
    for(const r of ranges) {
        const grid = grid_get(r.x, r.y);
        if(grid_is_empty(grid)) {
            continue;
        }
        if(grid_is_tile(grid)) {
            continue;
        }
        grid_base_pop(grid);
        result += 1;
    }
    return result;
}

const hit_put = (value, ranges) => {
    let result = 0;
    for(const r of ranges) {
        const grid = grid_get(r.x, r.y);
        if(grid_is_tile(grid)) {
            continue;
        }
        grid_base_push(grid, value);
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
    if(hit === HIT_PUT) {
        return hit_put(value, ranges);
    }
    return 0;
};
