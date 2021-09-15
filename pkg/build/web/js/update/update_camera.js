
const updateCamera = (save, frame) => {
    const height = 1.75;

    const pos = save.position();
    const angle = save.angle();
    frame.setCamera(pos[0], pos[1] + height, pos[2], angle[0], angle[1]);
    frame.calcMatrix();
};
