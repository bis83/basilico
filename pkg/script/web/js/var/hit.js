
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

const hit_activate = (ranges) => {
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
        }
    }
};
