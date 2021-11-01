
const drawReticle = (store) => {
    gl_state(store.gl, false, true);

    const shader = store_bundleGet(store, "shader", "mesh_pc");
    if(!shader) {
        return;
    }
    store.gl.useProgram(shader.prog);
    store.gl.uniformMatrix4fv(shader.u.vp, false, store.camera.ortho);

    const mesh = store_bundleGet(store, "mesh", "reticle");
    if(!mesh) {
        return;
    }
    store.gl.bindVertexArray(mesh.vao);
    
    // TODO: UniformBuffer
    // store.gl.bindBufferRange(store.gl.UNIFORM_BUFFER, shader.ub.a, 0, 0, 0);
    const m = mat4make();
    mat4scale(m, 4, 4, 1);
    store.gl.uniformMatrix4fv(shader.u.w, false, m);

    gl_drawMesh(store.gl, mesh);
};
