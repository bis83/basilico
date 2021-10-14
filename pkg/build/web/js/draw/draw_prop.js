
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
    store.gl.uniformMatrix4fv(shader.uniform.vp, false, store.frame.viewProj);
    for(const item of draw.prop) {
        const mesh = store_bundleGet(store, "mesh", item.mesh);
        if(!mesh) {
            continue;
        }
        store.gl.bindVertexArray(mesh.vao);

        const count = item.matrix.length/16;
        for(let i=0; i<count; ++i) {
            const mat = item.matrix.slice(i*16, i*16+16);
            store.gl.uniformMatrix4fv(shader.uniform.w, false, mat);
            gl_drawMesh(store.gl, mesh);
        }
    }
};
