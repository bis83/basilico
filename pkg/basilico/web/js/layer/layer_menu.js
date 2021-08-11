
const layerMenu = (graphics) => {
    const rect2 = graphics.d2d.makeRect(128, 128);
    rect2.position(0, 0);
    rect2.color(1,0,0,1);
    
    const rect = graphics.d2d.makeRect(128, 128);
    rect.position(0, 32);
    rect.text("hoge");

    const begin = (reg) => {
        if(reg(REG_GAME_MODE) === GAME_MODE_PAUSE) {
            rect2.visible(true);
            rect.visible(true);
        } else {
            rect2.visible(false);
            rect.visible(false);
        }
    };
    const end = (reg, req) => {
        if(reg(REG_GAME_MODE) === GAME_MODE_PAUSE) {
            if(reg(REG_POINTER_STATE) === POINTER_STATE_END) {
                req(REG_REQUEST_RESUME);
            }
        } else {
            req(REG_REQUEST_RESUME);
        }
    };
    return {
        begin: begin,
        end: end
    }
};
