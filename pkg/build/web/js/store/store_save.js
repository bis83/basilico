
const makeStoreSave = () => {
    let scene = "";
    let position = [0, 0, 0];
    let angle = [0, 0];

    return {
        scene: () => scene,
        position: () => position,
        angle: () => angle,
        
        action: {
            scene: (name) => { scene = name; },
            position: (x, y, z) => { position = [x, y, z]; },
            angle: (x, y) => { angle = [x, y]; },
        }
    };
};
