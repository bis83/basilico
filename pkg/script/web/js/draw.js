
const draw_start_frame = () => {
    gl_resizeCanvas();
    gl_clear();
};

const draw_stack = () => {
    const m = new Float32Array(16);

    gl_state(true, false);
    for(let x=0; x<$temp.stack.w; ++x) {
        for(let y=0; y<$temp.stack.h; ++y) {
            const stack = temp_stack(x, y);
            if(!stack) {
                return;
            }

            let h=0;
            for(const s of stack) {
                const [id, count] = stack_get(s);
                const data = data_stack(id);
                if(!data) {
                    continue;
                }
                const shader = data_shader(data.shader);
                if(!shader) {
                    continue;
                }            
                const mesh = data_mesh(data.mesh);
                if(!mesh) {
                    continue;
                }
                $gl.useProgram(shader.prog);
                $gl.uniformMatrix4fv(shader.u.vp, false, $temp.cam.vp);
                $gl.bindVertexArray(mesh.vao);
                for(let i=0; i<count; ++i) {
                    const pos = vec3world(x, y, h);
                    m.set(mat4translate(pos[0], pos[1], pos[2]));
                    $gl.uniformMatrix4fv(shader.u.w, false, m);

                    gl_drawMesh(mesh);
                    h += data.height;
                }
            }
        }
    }
};

const draw_ui = () => {
    gl_state(false, true);
    const data = data_ui()
    if(!data) {
        return;
    }
    for(let u of data) {
        const ui = $temp.ui[u.name];
        if(!ui) {
            continue;
        }

        const shader = data_shader(u.shader);
        if(!shader) {
            return;
        }
        $gl.useProgram(shader.prog);
        $gl.uniformMatrix4fv(shader.u.vp, false, $temp.cam.o);

        const mesh = data_mesh(u.mesh);
        if(!mesh) {
            return;
        }
        $gl.bindVertexArray(mesh.vao);
        
        $gl.uniformMatrix4fv(shader.u.w, false, ui.m);
        gl_drawMesh(mesh);
    }
};

const draw = () => {
    draw_start_frame();
    draw_stack();
    draw_ui();
};
