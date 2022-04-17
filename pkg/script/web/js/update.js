
const update_pos_adjust = (x, y, dx, dy) => {
    let xx = x + dx;
    let yy = y + dy;

    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const h0 = temp_world_height(ix+0, iy+0);
    const h1 = temp_world_height(ix-1, iy+0);
    const h2 = temp_world_height(ix+1, iy+0);
    const h3 = temp_world_height(ix+0, iy-1);
    const h4 = temp_world_height(ix+0, iy+1);
    const r = 0.25;
    if(Math.abs(h0-h1) > 1) {
        xx = Math.max(xx, ix+r);
    }
    if(Math.abs(h0-h2) > 1) {
        xx = Math.min(xx, ix-r+1);
    }
    if(Math.abs(h0-h3) > 1) {
        yy = Math.max(yy, iy+r);
    }
    if(Math.abs(h0-h4) > 1) {
        yy = Math.min(yy, iy-r+1);
    }

    return [xx, yy];
};

const update_pos = () => {
    const dt = $listen.timer.deltaTime;

    const cameraSpeed = 90; // deg/s
    $temp.pos.ha += cameraSpeed * dt * $listen.input.cameraX;
    $temp.pos.va += cameraSpeed * dt * $listen.input.cameraY;

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
};

const update_camera = () => {
    const ww = window.innerWidth;
    const wh = window.innerHeight;
    const fovy = deg2rad(30);
    const zNear = 0.1;
    const zFar = 1000;

    const dir = vec3dir($temp.pos.ha, $temp.pos.va);
    const h = temp_world_height($temp.pos.x, $temp.pos.y);
    const eye = vec3world($temp.pos.x, $temp.pos.y, h);
    eye[1] += $temp.pos.h;

    const at = vec3add(eye, dir);
    const up = [0, 1, 0];
    const view = mat4lookat(eye, at, up);
    const proj = mat4perspective(fovy, ww/wh, zNear, zFar);
    
    $temp.cam.vp.set(mat4multiply(view, proj));
    $temp.cam.o.set(mat4ortho(ww, wh, 0, 1));
};

const update = () => {
    update_pos();
    update_camera();
};
