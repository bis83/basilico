
const tile_to_world = (x, y, h) => {
    return [x*2, y*2, h*0.5];
};

const tile_forward = (x, y, hang) => {
    const r = deg2rad(hang);
    const ix = Math.floor(x) + 0.5 + Math.cos(r);
    const iy = Math.floor(y) + 0.5 + Math.sin(r);
    return [Math.floor(ix), Math.floor(iy)];
};
