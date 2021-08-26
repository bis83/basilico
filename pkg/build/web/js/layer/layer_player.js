
const layerPlayer = (gamepad, graphics) => {
    const height = 1.75;
    const angle = [90, 0];
    const pos = vec3make();
    vec3set(pos, 0, 0, 0);

    const begin = () => {
        angle[0] += gamepad.cameraX();
        angle[1] += gamepad.cameraY();
        const x = deg2rad(angle[0]-90);
        const y = deg2rad(angle[0]);
        pos[0] += gamepad.moveX() * Math.cos(x) + gamepad.moveY() * Math.cos(y);
        pos[2] += gamepad.moveX() * Math.sin(x) + gamepad.moveY() * Math.sin(y);
    };
    const end = () => {
        graphics.setCamera(pos[0], pos[1] + height, pos[2], angle[0], angle[1]);
    };
    const draw = () => {
    };
    return {
        begin: begin,
        end: end,
        draw: draw,
    }
};
