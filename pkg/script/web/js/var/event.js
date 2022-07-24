
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
                hit = ui_value(ev.ui);
                break;
        }
        if(!hit) {
            continue;
        }
        for(const act of ev.action) {
            action_invoke(act);
        }
    }
};
