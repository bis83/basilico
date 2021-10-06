
const drawProp = (gl, { bundle: { draw, shader, mesh }, save, frame }) => {
    gl_state(gl, true, false);
    let data = draw.get(save.scene());
    if(!data) {
        return;
    }
    const sh = shader.get("mesh_pnc");
    if(!sh) {
        return;
    }
    sh.use();
    gl.uniformMatrix4fv(sh.vp, false, frame.viewProj());
    for(const item of data.prop) {
        const m = mesh.get(item.mesh);
        if(!m) {
            continue;
        }
        m.use();

        const count = item.matrix.length/16;
        for(let i=0; i<count; ++i) {
            const mat = item.matrix.slice(i*16, i*16+16);
            gl.uniformMatrix4fv(sh.w, false, mat);
            m.draw();
        }
    }
};
