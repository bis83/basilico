
const makeStoreSave = () => {
    let scene = "";
    let position = [0, 0, 0];
    let angle = [0, 0];
    const obj = {
        // getter
        scene: () => scene,
        position: () => position,
        angle: () => angle,
        // setter
        setScene: (name) => { scene = name; },
        setPosition: (x, y, z) => { position = [x, y, z]; },
        setAngle: (x, y) => { angle = [x, y]; },
    };
    return obj;
};
