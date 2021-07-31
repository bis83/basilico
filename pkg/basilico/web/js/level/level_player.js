
const makeLvPlayer = (browser, graphics) => {
    const controller = browser.makeController();
    const camera = graphics.makeCamera();
    const scene = graphics.makeScene();
    const box = scene.makeBox(0,0,0);
    const pos = [0, 0, 0];
    const dir = [0, 0];

    const pre = () => {
    };
    const post = () => {
        camera.set(pos[0], pos[1], pos[2], dir[0], dir[1]);
        camera.show();
        scene.show();
    };
    return {
        pre: pre,
        post: post
    }
};
