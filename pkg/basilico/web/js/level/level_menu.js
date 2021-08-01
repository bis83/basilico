
const makeLvMenu = (graphics) => {
    const rect = graphics.d2d.makeRect(128, 128);
    rect.position(200, 100);
    rect.text("hoge");

    const pre = () => {
    };
    const post = () => {
        rect.color(1,1,1,1);
    };
    return {
        pre: pre,
        post: post
    }
};
