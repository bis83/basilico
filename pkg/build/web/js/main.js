
listen(window, "load", () => {
    // context
    const gl = gl_createContext();
    const audio = audio_createContext();
    // store
    const store = {
        bundle: makeLoadBundle(gl),
        gamepad: makeStoreGamepad(),
        frame: makeStoreFrame(),
        save: makeStoreSave(),
    };
    updateStartGame(store);

    // AnimationLoop
    const update = () => {
        updateStartFrame(store);
        updatePlayer(store);
        updateCamera(store);
    };
    const draw = () => {
        drawStartFrame(gl);
        drawProp(gl, store);
    };
    const tick = () => {
        update();
        draw();
        requestAnimationFrame(tick);
    };
    tick();
});
