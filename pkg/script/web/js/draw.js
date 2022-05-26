
const draw_start_frame = () => {
    gl_resizeCanvas();
    gl_clear();
};

const draw_call = (no, count, func) => {
    const data = data_draw(no);
    if(!data) {
        return;
    }

    gl_state(data.depth, data.alpha);
    
    const shader = data_shader(data.shader);
    if(!shader) {
        return;
    }
    $gl.useProgram(shader.prog);

    const mesh = data_mesh(data.mesh);
    if(!mesh) {
        return;
    }
    $gl.bindVertexArray(mesh.vao);
    
    if(data.camera) {
        $gl.uniformMatrix4fv(shader.u[data.camera], false, $temp.cam.vp);
    }
    if(data.ortho) {
        $gl.uniformMatrix4fv(shader.u[data.ortho], false, $temp.cam.o);
    }

    for(let i=0; i<count; ++i) {
        func(shader.u, i);
        gl_drawMesh(mesh);
    }
};

const draw_stack = () => {
    for(let x=0; x<$stack.w; ++x) {
        for(let y=0; y<$stack.h; ++y) {
            const stack = stack_value(x, y);
            if(!stack) {
                continue;
            }
            let h=0;
            for(const s of stack) {
                const [id, count] = stack_get(s);
                const data = data_stack(id);
                if(!data) {
                    continue;
                }
                draw_call(data.draw, count, (u, i) => {
                    const pos = vec3world(x, y, h);
                    const m = new Float32Array(16);
                    m.set(mat4translate(pos[0], pos[1], pos[2]));
                    $gl.uniformMatrix4fv(u.w, false, m);
                    h += data.height;
                });
            }
        }
    }
};

const draw_ui = (view) => {
    for(let no of view.ui) {
        const ui = data_ui(no);
        if(!ui) {
            continue;
        }
        const tui = $ui[ui.name];
        if(!tui) {
            continue;
        }
        draw_call(ui.draw, 1, (u, i) => {
            $gl.uniformMatrix4fv(u.w, false, tui.m);
        });
    }
};

const draw_skybox = () => {
    const no = $data.index.skybox;
    if(no < 0) {
        return;
    }
    draw_call(no, 1, (u, i) => {
        const m = new Float32Array(16);
        m.set(mat4translate(...$temp.cam.eye));
        $gl.uniformMatrix4fv(u.w, false, m);
    });
};
