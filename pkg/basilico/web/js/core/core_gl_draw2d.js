
const makeGLDraw2d = (gl, linker, texLoader) => {
    // Rendering Pass
    const rects = [];
    const render = (vp) => {
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        for(let r of rects) {
            r(vp);
        }
    };

    // Objects
    const makeRect = (w, h) => {
        const xy = [0,0];
        const col = [1,1,1,1];

        let prog = linker("rect");
        let tex = null;
        const render = (vp) => {
            if(!prog) {
                return;
            }
            prog.use();
            if(tex) {
                tex.bind();
                gl.uniform1i(prog.tex, 0);
            }
            gl.uniform4f(prog.xywh,
                2 * (xy[0] / vp.w) - 1,
                1 - 2 * (xy[1] / vp.h),
                2 * (w / vp.w),
                2 * (h / vp.h));
            gl.uniform4f(prog.col, col[0], col[1], col[2], col[3]);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        };
        rects.push(render);

        const dispose = () => {
            const index = rects.findIndex(render);
            if(index >= 0) {
                rects.splice(index, 1);                
            }
            if(tex) {
                tex.dispose();
                tex = null;
            }
            prog = null;
        };
        const position = (x,y) => {
            xy[0] = x;
            xy[1] = y;
        };
        const color = (r,g,b,a) => {
            col[0] = r;
            col[1] = g;
            col[2] = b;
            col[3] = a;
        };
        const text = (contents) => {
            if(tex) {
                tex.dispose();
                tex = null;
            }
            prog = linker("rect_tex");
            tex = texLoader.makeText(contents, w, h);
        };
        return {
            dispose: dispose,
            position: position,
            color: color,
            text: text,
        };
    };

    return {
        render: render,
        makeRect: makeRect,
    };
};
