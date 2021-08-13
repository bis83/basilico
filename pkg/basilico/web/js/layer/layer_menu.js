
const layerMenu = (engine, graphics) => {
    const rect = graphics.d2d.makeRect(128, 128);
    rect.position(0, 0);
    rect.text("pause");

    const begin = () => {
        rect.visible(!engine.active());
    };
    const end = () => {
    };
    return {
        begin: begin,
        end: end
    }
};
