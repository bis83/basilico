
window.addEventListener("load", () => {
    let suspend = true;

    const audio = makeCoreAudio();
    const browser = makeCoreBrowser();
    const graphics = makeCoreGraphics();
    const package = makeCorePackage();
    const space2d = makeCoreSpace2d();
    const space3d = makeCoreSpace3d();
    const userdata = makeCoreUserData();
    const lvMenu = makeLvMenu();
    const lvPlayer = makeLvPlayer();

    userdata.start();

    const tickMenu = () => {
        lvMenu.pre();
        space2d.tick();
        lvMenu.post();
    };
    const tickWorld = () => {
        lvPlayer.pre();
        space3d.tick();
        lvPlayer.post();
    };
    const tick = (t) => {
        LOG("frame: " + t);
        graphics.begin();
        browser.tick(t);
        package.tick();
        userdata.tick();
        if(suspend) {
            tickMenu();
        } else {
            tickWorld();
        }
        audio.tick();
        graphics.end();
        requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
});
