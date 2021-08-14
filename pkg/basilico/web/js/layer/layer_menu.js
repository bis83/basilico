
const layerMenu = (engine, graphics) => {
    let x = 0;
    let y = 0;
    let w = 128;
    let h = 128;
    const tex = graphics.texture.makeText("pause", w, h);
    const prog = graphics.shader("rect_tex");

    const begin = () => {
    };
    const end = () => {
    };
    const draw = () => {
        if(engine.active()) {
            return;
        }

        const gl = graphics.gl();
        const vp = graphics.viewport();
        prog.use();
        tex.bind();
        gl.uniform1i(prog.tex, 0);
        gl.uniform4f(prog.xywh,
            (x / vp.w),
            (x / vp.h),
            (w / vp.w),
            (h / vp.h));
        gl.uniform4f(prog.col, 1, 1, 1, 1);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    return {
        begin: begin,
        end: end,
        draw: draw,
    }
};
