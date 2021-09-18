
const drawProp = (gl, bundle, getFrame, getSave) => {
    gl_state(gl, true, false);
    const data = bundle.prop.get(getSave.scene());
    if(!data) {
        return;
    }
    const shader = bundle.shader.get("mesh_pc");
    if(!shader) {
        return;
    }
    shader.use();
    gl.uniformMatrix4fv(shader.vp, false, getFrame.viewProj());
    for(const item of data) {
        const mesh = bundle.mesh.get(item.mesh);
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
