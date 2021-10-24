
const drawProp = (store) => {
    gl_state(store.gl, true, false);
    const draw = store_bundleGet(store, "draw", store.save.scene);
    if(!draw) {
        return;
    }
    const shader = store_bundleGet(store, "shader", "mesh_pnc");
    if(!shader) {
        return;
    }

    store.gl.useProgram(shader.prog);
    store.gl.uniformMatrix4fv(shader.u.vp, false, store.camera.viewProj);
    for(const item of draw.prop) {
        const mesh = store_bundleGet(store, "mesh", item.mesh);
        if(!mesh) {
            continue;
        }
        store.gl.bindVertexArray(mesh.vao);
        for(let i=0; i<item.count; ++i) {
            store.gl.bindBufferRange(store.gl.UNIFORM_BUFFER, shader.ub.a, item.matrix, i*item.stride, item.size);
            gl_drawMesh(store.gl, mesh);
        }
    }
};
