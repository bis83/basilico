
const updatePlayer = ({ save, gamepad, frame }) => {
    const dt = frame.deltaTime();
    let [ax, ay] = save.angle();
    let [x, y, z] = save.position();
    const cameraX = gamepad.cameraX();
    const cameraY = gamepad.cameraY();
    const moveX = gamepad.moveX();
    const moveY = gamepad.moveY();

    const speed = 4;
    ax += cameraX;
    ay += cameraY;
    const rx = deg2rad(ax-90);
    const ry = deg2rad(ax);
    const dx = speed * dt * (moveX * Math.cos(rx) + moveY * Math.cos(ry));
    const dz = speed * dt * (moveX * Math.sin(rx) + moveY * Math.sin(ry));
    x += dx;
    z += dz;

    save.action.angle(ax, ay);
    save.action.position(x, y, z);
};
