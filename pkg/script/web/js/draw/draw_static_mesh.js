
const drawStaticMesh = (store) => {
    gl_state(true, false);
    const draw = $data_draw(store.save.scene);  // FIXME:
    if(!draw) {
        return;
    }
    const shader = $data_shader($data.index.data.mesh_pnc);
    if(!shader) {
        return;
    }

    $gl.useProgram(shader.prog);
    $gl.uniformMatrix4fv(shader.u.vp, false, store.camera.viewProj);
    for(const item of draw.static) {
        const mesh = $data_mesh(item.mesh);
        if(!mesh) {
            continue;
        }
        $gl.bindVertexArray(mesh.vao);
        for(let i=0; i<item.count; ++i) {
            $gl.bindBufferRange($gl.UNIFORM_BUFFER, shader.ub.a, item.matrix, i*item.stride, item.size);
            gl_drawMesh(mesh);
        }
    }
};