
const layerMenu = (graphics) => {
    const rect = graphics.d2d.makeRect(128, 128);
    rect.position(200, 100);
    rect.text("hoge");

    const begin = () => {
    };
    const end = () => {
        rect.color(1,1,1,1);
    };
    return {
        begin: begin,
        end: end
    }
};
