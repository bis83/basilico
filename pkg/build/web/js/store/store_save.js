
const makeStoreSave = () => {
    let scene = "";
    const angle = [0, 0];
    const pos = vec3make();
    vec3set(pos, 0, 0, 0);

    const obj = {
        // getter
        scene: () => scene,
        position: () => pos,
        angle: () => angle,
        // setter
        setScene: (name) => { scene = name; },
        setPosition: (x, y, z) => { vec3set(pos, x, y, z); },
        setAngle: (x, y) => { angle[0] = x; angle[1] = y; },
    };
    return obj;
};
