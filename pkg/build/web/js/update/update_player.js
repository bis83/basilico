
const updatePlayer = (gamepad, save) => {
    const pos = save.position();
    const angle = save.angle();

    const rx = angle[0] + gamepad.cameraX();
    const ry = angle[1] + gamepad.cameraY();

    const x = deg2rad(rx-90);
    const y = deg2rad(rx);
    const dx = gamepad.moveX() * Math.cos(x) + gamepad.moveY() * Math.cos(y);
    const dz = gamepad.moveX() * Math.sin(x) + gamepad.moveY() * Math.sin(y); 

    const px = pos[0] + dx;
    const py = 0;
    const pz = pos[2] + dz;

    save.setPosition(px, py, pz);
    save.setAngle(rx, ry);
};
