
listen(window, "load", () => {
    const store = store_init();
    const tick = () => {
        update(store);
        draw(store);
        requestAnimationFrame(tick);
    };
    tick();
});
