
listen(window, "load", () => {
    init();
    const tick = (time) => {
        update(time);
        draw();
        requestAnimationFrame(tick);
    };
    tick();
});
