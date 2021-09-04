
const layerProp = (graphics, scene) => {
    let prog = graphics.shader("mesh");
    const begin = () => {
    };
    const end = () => {
    };
    const draw = () => {
        const s = scene.get();
        if(!s) {
            return;
        }

        prog.use();
        const gl = graphics.gl();
        gl.uniformMatrix4fv(prog.viewProj, false, graphics.viewProj());

        for(const prop of s.prop) {
            const mesh = graphics.mesh.getMesh(prop.mesh);
            mesh.use();

            const count = prop.matrix.length/16;
            for(let i=0; i<count; ++i) {
                const mat = prop.matrix.slice(i*16, i*16+16);
                gl.uniformMatrix4fv(prog.world, false, mat);
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
