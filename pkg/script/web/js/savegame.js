
const newgame = () => {
    pos_init();
    tile_init_empty();
    item_init_empty();
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
    if(data.item) {
        Object.assign($item, item_decode(data.item));
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
    data.item = item_encode($item);
    data.tile = tile_encode($tile);
    localstorage_set($temp.slot, data);
};
