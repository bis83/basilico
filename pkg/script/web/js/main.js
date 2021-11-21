
listen(window, "load", () => {
    $gl_init();
    $audio_init();
    $core_load();
    $pack_load(0);
    const tick = () => {
        if($core === null || $pack.length <= 0) {
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
