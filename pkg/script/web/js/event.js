
const $action = {};

const event_tick = (view) => {
    for(let no of view.event) {
        const ev = data_event(no);
        if(!ev) {
            continue;
        }
        let hit = false;
        switch(ev.trigger) {
            case 0: // always
                hit = true;
                break;
            case 1: // button
                hit = ui_value(ev.target);
                break;
        }
        if(hit) {
            for(const act of ev.action) {
                const func = $action[act[0]];
                if(!func) {
                    continue;
                }
                const args = act.slice(1);
                func(...args);
            }
        }
    }
};
