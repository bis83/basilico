
const drawProp = ({ gl, data, save, frame }) => {
    gl_state(gl, true, false);
    let draw = data.draw(save.scene());
    if(!draw) {
        return;
    }

    const sh = data.shader("mesh_pnc");
    if(!sh) {
        return;
    }
    sh.use();
    gl.uniformMatrix4fv(sh.vp, false, frame.viewProj());
    for(const item of draw.prop) {
        const m = data.mesh(item.mesh);
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
