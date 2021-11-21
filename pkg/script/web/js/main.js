
listen(window, "load", () => {
    $gl_init();
    $audio_init();
    $data_loadIndex();
    $data_loadPack(0);
    const tick = () => {
        if(!$data_loaded()) {
            requestAnimationFrame(tick);
            return;
        }
        if($store === null) {
            store_init();
        }
        update($store);
        draw($store);
        requestAnimationFrame(tick);
    };
    tick();
});
