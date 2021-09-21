
listen(window, "load", () => {
    const gl = gl_createContext();
    const audio = audio_createContext();

    // load
    const bundle = makeLoadBundle(gl);
    // {{range $key, $value := .Spec}}
    bundle.load("{{$key}}");
    // {{end}}

    // store
    const store = {
        gamepad: makeStoreGamepad(),
        frame: makeStoreFrame(),
        save: makeStoreSave(),
    };
    updateStartGame(store);

    // AnimationLoop
    const tick = () => {
        // update
        updateStartFrame(store);
        updatePlayer(store);
        updateCamera(store);

        // draw
        drawStartFrame(gl);
        drawProp(gl, bundle, store);
        drawBillboard(gl, bundle, store);
        requestAnimationFrame(tick);
    };
    tick();
});
