
const updateStartFrame = ({ frame, gamepad }) => {
    frame.action.tick();
    gamepad.action.tick();
};
