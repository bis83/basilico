
window.addEventListener("load", () => {
    const audio = makeCoreAudio();
    const browser = makeCoreBrowser();
    const graphics = makeCoreGraphics();
    const package = makeCorePackage();
    const space2d = makeCoreSpace2d();
    const space3d = makeCoreSpace3d();
    const userdata = makeCoreUserData();    
    const layers = [
        layerMenu(graphics),
        layerPlayer(browser, graphics),
    ];

    userdata.start();

    const tick = (t) => {
        graphics.begin();
        browser.tick(t);
        package.tick();
        userdata.tick();
        layers.forEach(l => l.begin());
        space3d.solve();
        space2d.solve();
        layers.forEach(l => l.end());
        audio.tick();
        graphics.end();
        requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
});
