
const updatePlayer = (gamepad, graphics, userdata) => {
    const height = 1.75;

    const begin = () => {
        const prog = userdata.prog();
        const pos = prog.position();
        const angle = prog.angle();

        const rx = angle[0] + gamepad.cameraX();
        const ry = angle[1] + gamepad.cameraY();

        const x = deg2rad(rx-90);
        const y = deg2rad(rx);
        const dx = gamepad.moveX() * Math.cos(x) + gamepad.moveY() * Math.cos(y);
        const dz = gamepad.moveX() * Math.sin(x) + gamepad.moveY() * Math.sin(y); 

        const px = pos[0] + dx;
        const py = height;
        const pz = pos[2] + dz;

        prog.setPosition(px, py, pz);
        prog.setAngle(rx, ry);
    };
    const end = () => {
        const prog = userdata.prog();
        const pos = prog.position();
        const angle = prog.angle();

        graphics.setCamera(pos[0], pos[1] + height, pos[2], angle[0], angle[1]);
    };
    return {
        begin: begin,
        end: end,
    }
};
