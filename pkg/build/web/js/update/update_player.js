
const updatePlayer = (getGamepad, getSave, setSave) => {
    let [ax, ay] = getSave.angle();
    let [x, y, z] = getSave.position();

    ax += getGamepad.cameraX();
    ay += getGamepad.cameraY();

    const rx = deg2rad(ax-90);
    const ry = deg2rad(ax);
    const dx = getGamepad.moveX() * Math.cos(rx) + getGamepad.moveY() * Math.cos(ry);
    const dz = getGamepad.moveX() * Math.sin(rx) + getGamepad.moveY() * Math.sin(ry); 
    x += dx;
    z += dz;

    setSave.angle(ax, ay);
    setSave.position(x, y ,z);
};
