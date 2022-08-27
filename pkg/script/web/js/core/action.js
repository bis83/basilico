
const $action = {};
const action_invoke = (action) => {
    for(const act of action) {
        const func = $action[act[0]];
        if(!func) {
            continue;
        }
        const args = act.slice(1);
        func(...args);
    }
};

const define_action = (label, func) => {
    $action[label] = func;
};
