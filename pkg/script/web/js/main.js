
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
        view_tick();
        const view = data_view($temp.view);
        if(!view) {
            return;
        }
        ui_tick(view);
        event_tick(view);
    }
    camera_tick();
    listen_flush();
};

const draw = () => {
    draw_start_frame();
    if(data_loaded()) {
        const view = data_view($temp.view);
        if(!view) {
            return;
        }
        draw_view(view);
    }
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
