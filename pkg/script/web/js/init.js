
const init_newgame = () => {
    $stack.w = 64;
    $stack.h = 64;
    $stack.a.length = 0;
    $stack.a.length = $stack.w * $stack.h;
    for(let i=0; i<$stack.a.length; ++i) {
        const h = 1 + Math.floor(Math.random() * 10)
        $stack.a[i] = [];
        $stack.a[i].push(stack_set(1, h));
    }

    $pos.x = 0.5;
    $pos.y = 0.5;
};

const init_loadgame = () => {
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

const init_savegame = () => {
    if(!$temp.slot) {
        return;
    }

    const data = {};
    data.pos = $pos;
    data.stack = $stack;
    localstorage_set($temp.slot, data);
};
