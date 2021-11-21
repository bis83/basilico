
const updatePlayer = (store) => {
    const dt = store.timer.deltaTime;
    let [ax, ay] = store.save.angle;
    let [x, y, z] = store.save.position;
    let vy = store.save.vy;
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

    // Jump
    if(y <= 0.0 && store.input.jump) {
        vy = 4;
    }
    vy += -GRAVITY * dt;

    // Move
    const moveSpeed = 4;    // m/s
    const rx = deg2rad(ax-90);
    const ry = deg2rad(ax);
    const vx = moveSpeed * (moveX * Math.cos(rx) + moveY * Math.cos(ry));
    const vz = moveSpeed * (moveX * Math.sin(rx) + moveY * Math.sin(ry));
    x += vx * dt;
    y += vy * dt;
    z += vz * dt;
    
    if(y <= 0.0) {
        y = 0.0;
        vy = 0.0;
    }

    // Sneak
    if(y <= 0.0 && store.input.sneak) {
        store_saveSneakAction(store, !store.save.sneak);
    }

    store_saveAngleAction(store, ax, ay);
    store_savePositionAction(store, x, y, z);
    store_saveVelocityAction(store, vy);
};
