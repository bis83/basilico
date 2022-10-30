
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
    if(data.com) {
        for(let no of data.com) {
            const com = $view.com[no];
            if(com) {
                draw_com(com, no);
            }
        }
    }
};
