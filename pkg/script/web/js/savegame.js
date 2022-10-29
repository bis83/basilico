
const newgame = () => {
    grid_init_empty();
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
    if(data.item) {
        Object.assign($item, item_decode(data.item));
    }
    if(data.grid) {
        Object.assign($grid, grid_decode(data.grid));
    }
    return true;
};

const savegame = () => {
    if(!$view.slot) {
        return;
    }

    const data = {};
    data.item = item_encode($item);
    data.grid = grid_encode($grid);
    localstorage_set($view.slot, data);
};
