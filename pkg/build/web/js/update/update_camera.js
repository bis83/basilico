
const updateCamera = (save, frame) => {
    const height = 1.75;
    const [x, y, z] = save.position();
    const [ax, ay] = save.angle();
    frame.setCamera(x, y + height, z, ax, ay);
    frame.calcMatrix();
};
