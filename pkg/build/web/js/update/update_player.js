
const updatePlayer = (getFrame, getGamepad, getSave, setSave) => {
    const speed = 4;
    let dt = getFrame.deltaTime();
    let [ax, ay] = getSave.angle();
    let [x, y, z] = getSave.position();

    ax += getGamepad.cameraX();
    ay += getGamepad.cameraY();

    const rx = deg2rad(ax-90);
    const ry = deg2rad(ax);
    const dx = speed * dt * (getGamepad.moveX() * Math.cos(rx) + getGamepad.moveY() * Math.cos(ry));
    const dz = speed * dt * (getGamepad.moveX() * Math.sin(rx) + getGamepad.moveY() * Math.sin(ry));
    x += dx;
    z += dz;

    setSave.angle(ax, ay);
    setSave.position(x, y ,z);
};
