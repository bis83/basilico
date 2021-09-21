
const drawBillboard = (gl, { billboard, shader, mesh, texture }, { save, frame }) => {
    gl_state(gl, false, true);
    
    const data = billboard.get(save.scene());
    if(!data) {
        return;
    }
    
    const sh = shader.get("mesh_pct");
    if(!sh) {
        return;
    }
    sh.use();

    for(const item of data) {
        if(item.is_pause && !frame.pause()) {
            continue;
        }
        if(item.is_ortho) {
            gl.uniformMatrix4fv(sh.vp, false, frame.ortho());
        } else {
            gl.uniformMatrix4fv(sh.vp, false, frame.viewProj());
        }
        
        const m = mesh.get(item.mesh);
        if(!m) {
            continue;
        }
        m.use();
        
        const tex = texture.get(item.texture);
        if(!tex) {
            continue;
        }
        tex.bind(sh.t);

        const count = item.matrix.length/16;
        for(let i=0; i<count; ++i) {
            const mat = item.matrix.slice(i*16, i*16+16);
            gl.uniformMatrix4fv(sh.w, false, mat);
            m.draw();
        }
    } 
};
