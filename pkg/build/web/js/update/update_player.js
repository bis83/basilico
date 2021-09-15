
const updatePlayer = (gamepad, save) => {
    let [ax, ay] = save.angle();
    ax += gamepad.cameraX();
    ay += gamepad.cameraY();
    save.setAngle(ax, ay);

    let [x, y, z] = save.position();
    const rx = deg2rad(ax-90);
    const ry = deg2rad(ax);
    const dx = gamepad.moveX() * Math.cos(rx) + gamepad.moveY() * Math.cos(ry);
    const dz = gamepad.moveX() * Math.sin(rx) + gamepad.moveY() * Math.sin(ry); 
    x += dx;
    z += dz;
    save.setPosition(x, y ,z);
};
