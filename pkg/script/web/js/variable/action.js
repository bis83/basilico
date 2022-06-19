
const $action = {};

const action_invoke = (act) => {
    const func = $action[act[0]];
    if(!func) {
        return;
    }
    const args = act.slice(1);
    func(...args);
};
