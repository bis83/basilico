
const layerMenu = (engine, graphics) => {
    let x = 0;
    let y = 0;
    let w = 128;
    let h = 128;

    const begin = () => {
    };
    const end = () => {
    };
    const draw = () => {
        if(engine.active()) {
            return;
        }
        const prog = graphics.shader.get("mesh_pct");
        if(!prog) {
            return;
        }
        const tex = graphics.texture.get("pause")
        if(!tex) {
            return;
        }
        const mesh = graphics.mesh.get("rect");
        if(!mesh) {
            return;
        }

        // const gl = graphics.gl();
        // const vp = graphics.viewport();
        prog.use();
        tex.bind(prog.t);
        // gl.uniform4f(prog.xywh, (x / vp.w), (y / vp.h), (w / vp.w), (h / vp.h));
        mesh.draw();
    };
    return {
        begin: begin,
        end: end,
        draw: draw,
    }
};
