
const makeStoreSave = () => {
    let scene = "";
    let position = [0, 0, 0];
    let angle = [0, 0];

    const get = {
        scene: () => scene,
        position: () => position,
        angle: () => angle,
    };
    const set = {
        scene: (name) => { scene = name; },
        position: (x, y, z) => { position = [x, y, z]; },
        angle: (x, y) => { angle = [x, y]; },
    };
    return [get, set];
};
