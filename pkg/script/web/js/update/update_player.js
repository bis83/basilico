
const updatePlayerCamera = (store) => {
    const dt = store.timer.deltaTime;
    let [ax, ay] = store.save.angle;
    const cameraX = store.input.cameraX;
    const cameraY = store.input.cameraY;

    const cameraSpeed = 90; // deg/s
    const dax = cameraSpeed * dt * cameraX;
    const day = cameraSpeed * dt * cameraY;
    ax += dax;
    ay += day;

    store_saveAngleAction(store, ax, ay);
};

const updatePlayerHorizontalMovement = (store) => {
    const dt = store.timer.deltaTime;
    let [x, y, z] = store.save.position;
    let [ax, ay] = store.save.angle;
    const moveX = store.input.moveX;
    const moveY = store.input.moveY;
    const height = store_saveHeightGet(store);

    const moveSpeed = 4;    // m/s
    const rx = deg2rad(ax-90);
    const ry = deg2rad(ax);
    const vx = moveSpeed * (moveX * Math.cos(rx) + moveY * Math.cos(ry));
    const vz = moveSpeed * (moveX * Math.sin(rx) + moveY * Math.sin(ry));

    let vdir = xy_normalize(vx, vz);
    vdir = xy_mul(vdir, 1);

    let dx = vx * dt + vdir[0];
    let dz = vz * dt + vdir[1];

    const txz = $data_update_ground_check(store.save.scene, [x, y + height/2, z], [dx, 0, dz]);
    if(txz !== null) {
        dx = (txz * dx);
        dz = (txz * dz);
    }
    if(Math.abs(dx) > Math.abs(vdir[0])) {
        dx -= vdir[0];
    } else {
        dx = 0;
    }
    if(Math.abs(dz) > Math.abs(vdir[1])) {
        dz -= vdir[1];
    } else {
        dz = 0;
    }

    x += dx;
    z += dz;

    store_savePositionAction(store, x, y, z);
};

const updatePlayerVerticalMovement = (store) => {
    const dt = store.timer.deltaTime;
    let [x, y, z] = store.save.position;
    const height = store_saveHeightGet(store);

    let vy = store.save.vy;
    vy += -GRAVITY * dt;

    y += height/2;
    let dy = vy * dt - height/2;

    const ty = $data_update_ground_check(store.save.scene, [x, y, z], [0, dy, 0]);
    if(ty !== null) {
        vy = Math.max(0, vy);
        dy = (ty * dy);
    }

    y += dy;

    store_savePositionAction(store, x, y, z);
    store_saveVelocityAction(store, vy);
};

const updatePlayerActions = (store) => {
    if(store.input.jump) {
        store_saveVelocityAction(store, 4);
    }
    if(store.input.sneak) {
        store_saveSneakAction(store, !store.save.sneak);
    }
};

const updatePlayer = (store) => {
    updatePlayerCamera(store);
    updatePlayerHorizontalMovement(store);
    updatePlayerVerticalMovement(store);
    updatePlayerActions(store);
};
