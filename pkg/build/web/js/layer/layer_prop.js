
const layerProp = (graphics, scene) => {
    const begin = () => {
    };
    const end = () => {
    };
    const draw = () => {
        const s = scene.get();
        if(!s) {
            return;
        }
        const prog = graphics.shader.get("mesh_pc");
        if(!prog) {
            return;
        }
        prog.use();

        const gl = graphics.gl();
        gl.uniformMatrix4fv(prog.vp, false, graphics.viewProj());

        for(const prop of s.prop) {
            const mesh = graphics.mesh.get(prop.mesh);
            if(!mesh) {
                continue;
            }
            mesh.use();

            const count = prop.matrix.length/16;
            for(let i=0; i<count; ++i) {
                const mat = prop.matrix.slice(i*16, i*16+16);
                gl.uniformMatrix4fv(prog.w, false, mat);
                mesh.draw();
            }
        }
    };
    return {
        begin: begin,
        end: end,
        draw: draw,
    }
};
