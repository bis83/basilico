
listen(window, "load", () => {
    gl_init();
    audio_init();
    listen_init();
    data_loadIndex();
    data_loadPack(0);
    const tick = () => {
        listen_tick();
        ui_tick();
        if(data_loaded()) {
            init();
            update();
            draw();
        }
        requestAnimationFrame(tick);
    };
    tick();
});
