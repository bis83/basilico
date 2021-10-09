
listen(window, "load", () => {
    const gl = gl_createContext();
    const audio = audio_createContext();
    const store = {
        gl,
        audio,
        data: makeStoreData(gl, audio),
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
        drawStartFrame(store);
        drawProp(store);
    };
    const tick = () => {
        update();
        draw();
        requestAnimationFrame(tick);
    };
    tick();
});
