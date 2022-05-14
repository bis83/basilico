
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
                $gl.useProgram(shader.prog);
                $gl.uniformMatrix4fv(shader.u.vp, false, $temp.cam.vp);

                const mesh = data_mesh(data.mesh);
                if(!mesh) {
                    continue;
                }
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
    const layout = data_ui_layout($temp.pause);
    if(!layout) {
        return;
    }
    
    gl_state(false, true);
    for(let no of layout) {
        const ui = data_ui(no);
        if(!ui) {
            continue;
        }
        const tui = $temp.ui[ui.name];
        if(!tui) {
            continue;
        }

        const shader = data_shader(ui.shader);
        if(!shader) {
            return;
        }
        $gl.useProgram(shader.prog);
        $gl.uniformMatrix4fv(shader.u.vp, false, $temp.cam.o);

        const mesh = data_mesh(ui.mesh);
        if(!mesh) {
            return;
        }
        $gl.bindVertexArray(mesh.vao);
        
        $gl.uniformMatrix4fv(shader.u.w, false, tui.m);
        gl_drawMesh(mesh);
    }
};

const draw = () => {
    draw_start_frame();
    if($temp.pause === false) {
        draw_stack();
    }
    draw_ui();
};
