
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
    
    $gl.uniformMatrix4fv(shader.u.vp, false, data.ortho ? $view.cam.o : $view.cam.vp);

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
    // base
    for(let x=0; x<$tile.w; ++x) {
        for(let y=0; y<$tile.h; ++y) {
            const tile = tile_base(x, y);
            if(!tile) {
                continue;
            }
            const data = data_tile(tile.no);
            if(!data) {
                continue;
            }
            draw_call(data.draw, tile.count, (u, i) => {
                const pos = tile_to_world(x, y, i*data.height);
                $view.m.set(mat4translate(pos[0], pos[1], pos[2]));
                $gl.uniformMatrix4fv(u.w, false, $view.m);
            });
        }
    }
    // prop
    for(let x=0; x<$tile.w; ++x) {
        for(let y=0; y<$tile.h; ++y) {
            const tile = tile_prop(x, y);
            if(!tile) {
                continue;
            }
            const data = data_tile(tile.no);
            if(!data) {
                continue;
            }
            const h = tile_base_height(x, y);
            draw_call(data.draw, 1, (u, i) => {
                const pos = tile_to_world(x, y, h);
                $view.m.set(mat4translate(pos[0], pos[1], pos[2]));
                $gl.uniformMatrix4fv(u.w, false, $view.m);
            });
        }
    }
};

const draw_component = (view) => {
    for(let no of view.component) {
        const data = data_component(no);
        if(!data) {
            continue;
        }
        if(data.draw < 0) {
            continue;
        }

        const co = $co[no];
        if(!co) {
            continue;
        }
        draw_call(data.draw, 1, (u, i) => {
            $gl.uniformMatrix4fv(u.w, false, co.m);
        });
    }
};

const draw_skybox = (view) => {
    draw_call(view.skybox, 1, (u, i) => {
        $view.m.set(mat4translate(...$view.cam.eye));
        $gl.uniformMatrix4fv(u.w, false, $view.m);
    });
};

const draw_view = () => {
    const view = data_view($view.view);
    if(!view) {
        return;
    }
    draw_skybox(view);
    if(view.draw3d) {
        draw_tile();
    }
    draw_component(view);
};
