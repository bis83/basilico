
const updateCamera = (store) => {
    const [x, y, z] = store.save.position;
    const [ax, ay] = store.save.angle;
    const height = store_saveHeightGet(store);

    store_cameraTickAction(store, x, y + height, z, ax, ay);
};
