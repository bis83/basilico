
const init = () => {
    gl_init();
    audio_init();
    listen_init();
    data_loadIndex();
    data_loadPack(0);
};

const update = (time) => {
    timer_tick(time);
    listen_tick();
    if(data_loaded()) {
        view_tick_before();
        const view = data_view($view.view);
        if(!view) {
            return;
        }
        ui_tick(view);
        event_tick(view);
    }
    view_tick_after();
    listen_flush();
};

const draw = () => {
    draw_start_frame();
    if(data_loaded()) {
        const view = data_view($view.view);
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
