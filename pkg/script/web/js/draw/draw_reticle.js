
const drawReticle = (store) => {
    gl_state(false, true);

    const shader = $data_shader($data.index.data.mesh_pc);
    if(!shader) {
        return;
    }
    $gl.useProgram(shader.prog);
    $gl.uniformMatrix4fv(shader.u.vp, false, store.camera.ortho);

    const mesh = $data_mesh($data.index.data.reticle);
    if(!mesh) {
        return;
    }
    $gl.bindVertexArray(mesh.vao);
    
    // TODO: UniformBuffer
    // store.gl.bindBufferRange(store.gl.UNIFORM_BUFFER, shader.ub.a, 0, 0, 0);
    const m = new Float32Array(16);
    m.set(mat4scale(4, 4, 1));
    $gl.uniformMatrix4fv(shader.u.w, false, m);

    gl_drawMesh(mesh);
};
