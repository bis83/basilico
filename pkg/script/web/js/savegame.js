
const newgame = () => {
    $tile.w = 0;
    $tile.h = 0;
    $tile.a.length = 0;
    $pos.x = 0;
    $pos.y = 0;
    $pos.ha = 0;
    $pos.va = 0;
};

const loadgame = () => {
    if(!$temp.slot) {
        return false;
    }

    const data = localstorage_get($temp.slot);
    if(!data) {
        return false;
    }
    if(data.pos) {
        Object.assign($pos, data.pos);
    }
    if(data.tile) {
        Object.assign($tile, tile_decode(data.tile));
    }
    return true;
};

const savegame = () => {
    if(!$temp.slot) {
        return;
    }

    const data = {};
    data.pos = $pos;
    data.tile = tile_encode($tile);
    localstorage_set($temp.slot, data);
};
