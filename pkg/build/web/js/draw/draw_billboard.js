
const drawBillboard = (engine, graphics, userdata, loader) => {
    const draw = () => {
        graphics.setState(false, true);

        const prog = userdata.prog();
        const data = loader.billboard.get(prog.scene());
        if(!data) {
            return;
        }

        const shader = graphics.shader.get("mesh_pct");
        if(!shader) {
            return;
        }
        shader.use();

        const gl = graphics.gl();
        for(const item of data) {
            if(item.is_pause && engine.active()) {
                continue;
            }
            if(item.is_ortho) {
                gl.uniformMatrix4fv(shader.vp, false, graphics.ortho());
            } else {
                gl.uniformMatrix4fv(shader.vp, false, graphics.viewProj());
            }

            const mesh = graphics.mesh.get(item.mesh);
            if(!mesh) {
                continue;
            }
            mesh.use();

            const texture = graphics.texture.get(item.texture);
            if(!texture) {
                continue;
            }
            texture.bind(shader.t);

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
    };
}
