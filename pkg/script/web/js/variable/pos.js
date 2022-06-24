
const $pos_eyeh = 1.75;
const $pos = {
    x: 0,
    y: 0,
    ha: 0,
    va: 0,
    h: 0,
};

const pos_init = (x, y, ha, va) => {
    $pos.x = x || 0;
    $pos.y = y || 0;
    $pos.ha = ha || 0;
    $pos.va = va || 0;
    $pos.h = 0;
};
