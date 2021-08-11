
window.addEventListener("load", () => {
    // CoreSystem
    const audio = makeCoreAudio();
    const browser = makeCoreBrowser();
    const engine = makeCoreEngine();
    const graphics = makeCoreGraphics();
    const package = makeCorePackage();
    const userdata = makeCoreUserData();    
    const layers = [
        layerMenu(graphics),
        layerPlayer(browser, graphics),
    ];
    userdata.start();

    // EventListener
    window.addEventListener("focus", (ev) => {
    });
    window.addEventListener("blur", (ev) => {
        browser.blur(ev);
    });
    window.addEventListener("resize", (ev) => {
    });
    window.addEventListener("gamepadconnected", (ev) => {
        browser.gamepadconnected(ev);
    });
    window.addEventListener("gamepaddisconnected", (ev) => {
        browser.gamepaddisconnected(ev);
    });
    document.body.addEventListener("click", (ev) => {
        audio.resume();
    });
    document.addEventListener("pointerlockchange", (ev) => {
        browser.pointerlockchange(ev);
    });
    document.addEventListener("keydown", (ev) => {
        browser.keydown(ev);
    });
    document.addEventListener("keyup", (ev) => {
        browser.keyup(ev);
    });
    document.body.addEventListener("mousedown", (ev) => {
        browser.mousedown(ev);
    });
    document.body.addEventListener("mouseup", (ev) => {
        browser.mouseup(ev);
    });
    document.body.addEventListener("mousemove", (ev) => {
        browser.mousemove(ev);
    });
    document.body.addEventListener("touchstart", (ev) => {
        browser.touchstart(ev);
    });
    document.body.addEventListener("touchmove", (ev) => {
        browser.touchmove(ev);
    });
    document.body.addEventListener("touchend", (ev) => {
        browser.touchend(ev);
    });

    // AnimationLoop
    const tick = (time) => {
        audio.tick();
        browser.tick();
        package.tick();
        userdata.tick();

        engine.begin(time, browser, userdata);
        layers.forEach(l => l.begin(engine.reg));
        engine.execute();
        layers.forEach(l => l.end(engine.reg, engine.req));
        engine.end(browser);

        if(engine.reg(REG_GAME_MODE) === GAME_MODE_ACTIVE) {
            graphics.clearColor(0, 0, 0);
        } else {
            graphics.clearColor(0.2, 0.2, 0.2);
        }
        graphics.render();
        requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
});
