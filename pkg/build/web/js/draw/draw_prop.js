
const drawProp = (graphics, userdata, loader) => {
    const draw = () => {
        graphics.setState(true, false);

        const prog = userdata.prog();
        const data = loader.prop.get(prog.scene());
        if(!data) {
            return;
        }

        const shader = graphics.shader.get("mesh_pc");
        if(!shader) {
            return;
        }
        shader.use();

        const gl = graphics.gl();
        gl.uniformMatrix4fv(shader.vp, false, graphics.viewProj());

        for(const item of data) {
            const mesh = graphics.mesh.get(item.mesh);
            if(!mesh) {
                continue;
            }
            mesh.use();

            const count = item.matrix.length/16;
            for(let i=0; i<count; ++i) {
                const mat = item.matrix.slice(i*16, i*16+16);
                gl.uniformMatrix4fv(shader.w, false, mat);
                mesh.draw();
            }
        }
    };
    return {
        draw: draw,
    }
};
