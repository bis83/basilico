
const updateCamera = (store) => {
    const height = 1.75;

    const [x, y, z] = store.save.position;
    const [ax, ay] = store.save.angle;

    store_cameraTickAction(store, x, y + height, z, ax, ay);
};
