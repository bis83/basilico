
listen(window, "load", () => {
    gl_init();
    audio_init();
    listen_init();
    temp_stack_init();
    data_loadIndex();
    data_loadPack(0);
    const tick = () => {
        listen_tick();
        if(data_loaded()) {
            update();
            draw();
        }
        requestAnimationFrame(tick);
    };
    tick();
});
