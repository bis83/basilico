
const update_pos_is_wall = (x, y, dx, dy) => {
    const h0 = temp_world_height(x, y);
    const h1 = temp_world_height(x+dx, y+dy);
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

    const cameraSpeed = 90; // deg/s
    $temp.pos.ha += cameraSpeed * dt * $listen.input.cameraX;
    $temp.pos.va += cameraSpeed * dt * $listen.input.cameraY;
    $temp.pos.va = Math.max(-60, Math.min($temp.pos.va, 80));

    const moveSpeed = 2;    // cell/s
    const rx = deg2rad($temp.pos.ha-90);
    const ry = deg2rad($temp.pos.ha);
    const moveX = $listen.input.moveX;
    const moveY = $listen.input.moveY;
    const vx = moveX * Math.cos(rx) + moveY * Math.cos(ry);
    const vy = moveX * Math.sin(rx) + moveY * Math.sin(ry);

    const dx = moveSpeed * dt * vx;
    const dy = moveSpeed * dt * vy;
    [$temp.pos.x, $temp.pos.y] = update_pos_adjust($temp.pos.x, $temp.pos.y, dx, dy);

    const h = temp_world_height($temp.pos.x, $temp.pos.y);
    if(Math.abs(h-$temp.pos.h) > 2) {
        $temp.pos.h = h;
    } else {
        const vh = h - $temp.pos.h;
        $temp.pos.h += 10 * dt * vh;
    }
};

const update_camera = () => {
    const ww = window.innerWidth;
    const wh = window.innerHeight;
    const fovy = deg2rad(30);
    const zNear = 0.1;
    const zFar = 1000;

    const dir = vec3dir($temp.pos.ha, $temp.pos.va);
    const eye = vec3world($temp.pos.x, $temp.pos.y, $temp.pos.h);
    eye[1] += $temp.pos.eyeh;

    const at = vec3add(eye, dir);
    const up = [0, 1, 0];
    const view = mat4lookat(eye, at, up);
    const proj = mat4perspective(fovy, ww/wh, zNear, zFar);
    
    $temp.cam.vp.set(mat4multiply(view, proj));
    $temp.cam.o.set(mat4ortho(ww, wh, 0, 1));
};

const update_creative = () => {
    if($listen.input.act) {
        const stack = temp_world_stack($temp.pos.x, $temp.pos.y);
        if(stack && stack.length > 0) {
            let [id, count] = stack_get(stack[stack.length-1]);
            count += 1;
            stack[stack.length-1] = stack_set(id, count);
        }
    }
    if($listen.input.sub) {
        const stack = temp_world_stack($temp.pos.x, $temp.pos.y);
        if(stack && stack.length > 0) {
            let [id, count] = stack_get(stack[stack.length-1]);
            count -= 1;
            if(count > 0) { 
                stack[stack.length-1] = stack_set(id, count);
            } else {
                stack.pop();
            }
        }
    }
};

const update = () => {
    update_pos();
    update_camera();
    update_creative();
};
