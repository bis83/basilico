
const init = () => {
    if($temp.init) {
        return;
    }

    if(!init_load()) {
        init_generate();
    }
    $temp.init = true;
};

const init_generate = () => {
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

const init_load = () => {
    const data = localstorage_get("data0");
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

const init_save = () => {
    const data = {};
    data.pos = $temp.pos;
    data.stack = $temp.stack;
    localstorage_set("data0", data);
};
