
const draw_start_frame = () => {
    gl_resizeCanvas();
    gl_clear();
};

const draw_call = (no, func) => {
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

    const img = data_image(data.image);
    if(img) {
        gl_useTexture(img.tex, shader.u.tex0);
    } else {
        gl_useTexture(null, shader.u.tex0);
    }

    func(shader.u);
    gl_drawMesh(mesh);
};

const draw_grid = () => {
    const draw_one = (x, y) => {
        const grid = grid_get(x, y);
        if(!grid) {
            return;
        }
        for(let i=0; i<grid.base.length; ++i) {
            const data = data_base(grid.base[i]);
            if(!data) {
                continue;
            }
            draw_call(data.draw, (u) => {
                const pos = grid_to_world(x, y, i);
                $view.m.set(mat4translate(pos[0], pos[1], pos[2]));
                $gl.uniformMatrix4fv(u.w, false, $view.m);
            });
        }

        const data = data_tile(grid.no);
        if(!data) {
            return;
        }
        const h = grid_height(grid);
        draw_call(data.draw, (u) => {
            const pos = grid_to_world(x, y, h);
            const m = mat4angle(grid.ha||0, grid.va||0);
            mat4translated(m, pos[0]+1, pos[1]+1, pos[2]);
            $view.m.set(m);
            $gl.uniformMatrix4fv(u.w, false, $view.m);
        });
    };
    for(let x=0; x<$grid.w; ++x) {
        for(let y=0; y<$grid.h; ++y) {
            draw_one(x, y);
        }
    }
};

const draw_com = (view) => {
    for(let no of view.com) {
        const data = data_com(no);
        if(!data) {
            continue;
        }
        if(data.draw <= 0) {
            continue;
        }

        const com = $view.com[no];
        if(!com) {
            continue;
        }
        draw_call(data.draw, (u) => {
            $gl.uniformMatrix4fv(u.w, false, com.m);
            if(com.img) {
                gl_useTexture(com.img, u.tex0);
            }
        });
    }
};

const draw_view = () => {
    const data = data_view($view.view);
    if(!data) {
        return;
    }
    if(data.draw) {
        for(let no of data.draw) {
            draw_call(no, (u) => {
                $view.m.set(mat4translate(...$view.cam.eye));
                $gl.uniformMatrix4fv(u.w, false, $view.m);
            });
        }
    }
    if(data.draw3d) {
        draw_grid();
    }
    draw_com(data);
};
