
const updateCamera = ({ save, frame }) => {
    const height = 1.75;

    const [x, y, z] = save.position();
    const [ax, ay] = save.angle();

    frame.action.camera(x, y + height, z, ax, ay);
};
