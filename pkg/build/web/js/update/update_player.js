
const updatePlayer = (store) => {
    const dt = store.timer.deltaTime;
    let [ax, ay] = store.save.angle;
    let [x, y, z] = store.save.position;
    const cameraX = store.input.cameraX;
    const cameraY = store.input.cameraY;
    const moveX = store.input.moveX;
    const moveY = store.input.moveY;

    // Camera
    const cameraSpeed = 90; // deg/s
    const dax = cameraSpeed * dt * cameraX;
    const day = cameraSpeed * dt * cameraY;
    ax += dax;
    ay += day;

    // Move
    const moveSpeed = 4;    // m/s
    const rx = deg2rad(ax-90);
    const ry = deg2rad(ax);
    const dx = moveSpeed * dt * (moveX * Math.cos(rx) + moveY * Math.cos(ry));
    const dz = moveSpeed * dt * (moveX * Math.sin(rx) + moveY * Math.sin(ry));
    x += dx;
    z += dz;

    store_saveAngleAction(store, ax, ay);
    store_savePositionAction(store, x, y, z);
};
