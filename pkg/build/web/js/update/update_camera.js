
const updateCamera = (getSave, setFrame) => {
    const height = 1.75;
    const [x, y, z] = getSave.position();
    const [ax, ay] = getSave.angle();

    setFrame.camera(x, y + height, z, ax, ay);
};
