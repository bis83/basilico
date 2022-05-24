
const newgame = () => {
    $stack.w = 0;
    $stack.h = 0;
    $stack.a.length = 0;
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
    if(data.stack) {
        Object.assign($stack, data.stack);
    }
    return true;
};

const savegame = () => {
    if(!$temp.slot) {
        return;
    }

    const data = {};
    data.pos = $pos;
    data.stack = $stack;
    localstorage_set($temp.slot, data);
};
