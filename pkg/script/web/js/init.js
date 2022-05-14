
const init_newgame = () => {
    $temp.stack.w = 64;
    $temp.stack.h = 64;
    $temp.stack.a.length = 0;
    $temp.stack.a.length = $temp.stack.w * $temp.stack.h;
    for(let i=0; i<$temp.stack.a.length; ++i) {
        const h = 1 + Math.floor(Math.random() * 10)
        $temp.stack.a[i] = [];
        $temp.stack.a[i].push(stack_set(1, h));
    }

    $temp.pos.x = 0.5;
    $temp.pos.y = 0.5;
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
        $temp.pos = data.pos;
    }
    if(data.stack) {
        $temp.stack = data.stack;
    }
    return true;
};

const init_savegame = () => {
    if(!$temp.slot) {
        return;
    }

    const data = {};
    data.pos = $temp.pos;
    data.stack = $temp.stack;
    localstorage_set($temp.slot, data);
};
