
const init = () => {
    gl_init();
    audio_init();
    listen_init();
    data_loadIndex();
    data_loadPack(0);
};

const update = (time) => {
    listen_tick(time);    
    if(data_loaded()) {
        reset_view();
        const view = data_view($temp.view);
        if(!view) {
            return;
        }
        ui_tick(view);
        event_tick(view);
    }
    update_camera();
    listen_flush();
};

listen(window, "load", () => {
    init();
    const tick = (time) => {
        update(time);
        draw();
        requestAnimationFrame(tick);
    };
    tick();
});
