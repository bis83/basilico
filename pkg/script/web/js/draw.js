
const draw_start_frame = () => {
    gl_resizeCanvas();
    gl_clear();
};

const draw_world_stack = (shader, mesh, x, y) => {
    const stack = temp_world_stack(x, y);
    if(!stack) {
        return;
    }
    let h=0;
    for(const s of stack) {
        const [id, count] = stack_get(s);
        for(let i=0; i<count; ++i) {
            const pos = vec3world(x, y, h);
            const m = new Float32Array(16);
            m.set(mat4translate(pos[0], pos[1], pos[2]));
            $gl.uniformMatrix4fv(shader.u.w, false, m);
            gl_drawMesh(mesh);
            ++h;
        }
    }
};
const draw_world = () => {
    gl_state(true, false);

    const shader = data_shader($data.index.data.mesh_pc);
    if(!shader) {
        return;
    }
    $gl.useProgram(shader.prog);
    $gl.uniformMatrix4fv(shader.u.vp, false, $temp.cam.vp);

    const mesh = data_mesh($data.index.data.stack);
    if(!mesh) {
        return;
    }
    $gl.bindVertexArray(mesh.vao);

    for(let x=0; x<$temp.world.w; ++x) {
        for(let y=0; y<$temp.world.h; ++y) {
            draw_world_stack(shader, mesh, x, y);
        }
    }
};

const draw_debug_grid = () => {
    gl_state(true, false);

    const shader = data_shader($data.index.data.mesh_pc);
    if(!shader) {
        return;
    }
    $gl.useProgram(shader.prog);
    $gl.uniformMatrix4fv(shader.u.vp, false, $temp.cam.vp);

    const mesh = data_mesh($data.index.data.debug_grid);
    if(!mesh) {
        return;
    }
    $gl.bindVertexArray(mesh.vao);

    const m = new Float32Array(16);
    m.set(mat4translate(0, 0, 0));
    $gl.uniformMatrix4fv(shader.u.w, false, m);

    gl_drawMesh(mesh);
};

const draw_reticle = () => {
    gl_state(false, true);

    const shader = data_shader($data.index.data.mesh_pc);
    if(!shader) {
        return;
    }
    $gl.useProgram(shader.prog);
    $gl.uniformMatrix4fv(shader.u.vp, false, $temp.cam.o);

    const mesh = data_mesh($data.index.data.reticle);
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

const draw = () => {
    draw_start_frame();
    draw_world();
    draw_debug_grid();
    draw_reticle();
};
