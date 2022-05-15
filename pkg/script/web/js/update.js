
const update_pos_is_wall = (x, y, dx, dy) => {
    const h0 = stack_height(x, y);
    const h1 = stack_height(x+dx, y+dy);
    if(Math.abs(h0-h1) > 1) {
        return true;
    }
    return false;
};

const update_pos_adjust = (x, y, dx, dy) => {
    let xx = x + dx;
    let yy = y + dy;

    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const r = 0.25;
    if(update_pos_is_wall(ix, iy, -1, 0)) {
        xx = Math.max(xx, ix+r);
    }
    if(update_pos_is_wall(ix, iy, +1, 0)) {
        xx = Math.min(xx, ix-r+1);
    }
    if(update_pos_is_wall(ix, iy, 0, -1)) {
        yy = Math.max(yy, iy+r);
    }
    if(update_pos_is_wall(ix, iy, 0, +1)) {
        yy = Math.min(yy, iy-r+1);
    }

    return [xx, yy];
};

const update_pos = () => {
    const dt = $listen.timer.deltaTime;

    const cameraXY = ui_value("right-stick");
    if(cameraXY) {
        const cameraSpeed = 90; // deg/s
        $pos.ha += cameraSpeed * dt * cameraXY[0];
        $pos.va += cameraSpeed * dt * cameraXY[1];
        $pos.va = Math.max(-60, Math.min($pos.va, 80));
    }

    const moveXY = ui_value("left-stick");
    if(moveXY) {
        const moveSpeed = 2;    // cell/s
        const rx = deg2rad($pos.ha+90);
        const ry = deg2rad($pos.ha);
        const moveX = moveXY[0];
        const moveY = moveXY[1];
        const vx = moveX * Math.cos(rx) + moveY * Math.cos(ry);
        const vy = moveX * Math.sin(rx) + moveY * Math.sin(ry);
        const dx = moveSpeed * dt * vx;
        const dy = moveSpeed * dt * vy;
        [$pos.x, $pos.y] = update_pos_adjust($pos.x, $pos.y, dx, dy);
    } else {
        [$pos.x, $pos.y] = update_pos_adjust($pos.x, $pos.y, 0, 0);
    }

    const h = stack_height($pos.x, $pos.y);
    if(Math.abs(h-$pos.h) <= 2) {
        const vh = h - $pos.h;
        $pos.h += 10 * dt * vh;
    } else {
        $pos.h = h;
    }
};

const update_camera = () => {
    const ww = window.innerWidth;
    const wh = window.innerHeight;
    const fovy = deg2rad(30);
    const zNear = 0.1;
    const zFar = 1000;

    const dir = vec3dir($pos.ha, $pos.va);
    const eye = vec3world($pos.x, $pos.y, $pos.h);
    eye[2] += $pos.eyeh;

    const at = vec3add(eye, dir);
    const up = [0, 0, 1];
    const view = mat4lookat(eye, at, up);
    const proj = mat4perspective(fovy, ww/wh, zNear, zFar);
    
    $temp.cam.vp.set(mat4multiply(view, proj));
    $temp.cam.o.set(mat4ortho(ww, wh, 0, 1));
};

const update_actions = () => {
    if(ui_value("button-act")) {
        const stack = stack_value($pos.x, $pos.y);
        if(stack && stack.length > 0) {
            let [id, count] = stack_get(stack[stack.length-1]);
            count += 1;
            stack[stack.length-1] = stack_set(id, count);
        }
        init_savegame();
    }
    if(ui_value("button-sub")) {
        const stack = stack_value($pos.x, $pos.y);
        if(stack && stack.length > 0) {
            let [id, count] = stack_get(stack[stack.length-1]);
            count -= 1;
            if(count > 0) { 
                stack[stack.length-1] = stack_set(id, count);
            } else {
                stack.pop();
            }
        }
        init_savegame();
    }
    if(ui_value("button-escape")) {
        $temp.pause = true;
    }
};

const update_pause = () => {
    if(ui_value("button-newgame")) {
        $temp.slot = "data0";
        init_newgame();
        $temp.pause = false;
    }
    if(ui_value("button-loadgame")) {
        $temp.slot = "data0";
        init_loadgame();
        $temp.pause = false;
    }
};

const update = (time) => {
    listen_tick(time);    
    if(data_loaded()) {
        if($temp.slot === null) {
            $temp.pause = true;
        }
        ui_tick();
        if($temp.pause) {
            update_pause();
        } else {
            update_pos();
            update_actions();
        }
        update_camera();
    }
    listen_flush();
};
