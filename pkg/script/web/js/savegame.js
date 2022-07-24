
const newgame = () => {
    pos_init();
    tile_init_empty();
    item_init_empty();
};

const loadgame = () => {
    if(!$view.slot) {
        return false;
    }

    const data = localstorage_get($view.slot);
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
    if(!$view.slot) {
        return;
    }

    const data = {};
    data.pos = $pos;
    data.item = item_encode($item);
    data.tile = tile_encode($tile);
    localstorage_set($view.slot, data);
};
