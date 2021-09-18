
const drawBillboard = (gl, bundle, getFrame, getSave) => {
    gl_state(gl, false, true);
    const data = bundle.billboard.get(getSave.scene());
    if(!data) {
        return;
    }
    const shader = bundle.shader.get("mesh_pct");
    if(!shader) {
        return;
    }
    shader.use();
    for(const item of data) {
        if(item.is_pause && !getFrame.pause()) {
            continue;
        }
        if(item.is_ortho) {
            gl.uniformMatrix4fv(shader.vp, false, getFrame.ortho());
        } else {
            gl.uniformMatrix4fv(shader.vp, false, getFrame.viewProj());
        }
        const mesh = bundle.mesh.get(item.mesh);
        if(!mesh) {
            continue;
        }
        mesh.use();
        const texture = bundle.texture.get(item.texture);
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
