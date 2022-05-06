
const ui_tick = () => {
    const data = data_ui()
    if(!data) {
        return;
    }
    for(let u of data) {
        if(!$temp.ui[u.name]) {
            $temp.ui[u.name] = {
                m: new Float32Array(16),
                value: null,
            };
        }
        const ui = $temp.ui[u.name];

        const m = mat4scale(u.width/2, u.height/2, 1);
        mat4translated(m, u.offset[0], u.offset[1], 0);
        ui.m.set(m);
    }
};
