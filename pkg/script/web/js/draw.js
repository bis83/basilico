
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
    
    $gl.uniformMatrix4fv(shader.u.vp, false, data.ortho ? $temp.cam.o : $temp.cam.vp);

    const tex = data_texture(data.texture);
    if(tex) {
        gl_useTexture(tex, shader.u.tex0);
    }

    for(let i=0; i<count; ++i) {
        func(shader.u, i);
        gl_drawMesh(mesh);
    }
};

const draw_tile = () => {
    for(let x=0; x<$tile.w; ++x) {
        for(let y=0; y<$tile.h; ++y) {
            const tile = tile_value(x, y);
            if(!tile) {
                continue;
            }
            let h=0;
            for(const s of tile) {
                const data = data_tile(s.no);
                if(!data) {
                    continue;
                }
                draw_call(data.draw, s.count, (u, i) => {
                    const pos = vec3world(x, y, h);
                    $temp.m.set(mat4translate(pos[0], pos[1], pos[2]));
                    $gl.uniformMatrix4fv(u.w, false, $temp.m);
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
        const tui = $ui[no];
        if(!tui) {
            continue;
        }
        draw_call(ui.draw, 1, (u, i) => {
            $gl.uniformMatrix4fv(u.w, false, tui.m);
        });
    }
};

const draw_skybox = (view) => {
    draw_call(view.skybox, 1, (u, i) => {
        $temp.m.set(mat4translate(...$temp.cam.eye));
        $gl.uniformMatrix4fv(u.w, false, $temp.m);
    });
};

const draw_view = (view) => {
    draw_skybox(view);
    if(view.draw3d) {
        draw_tile();
    }
    draw_ui(view);
};
