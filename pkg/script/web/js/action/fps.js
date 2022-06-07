
const pos_adjust = (x, y, dx, dy) => {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const r = 0.25;

    let xx = x + dx;
    let yy = y + dy;
    if(tile_is_noentry(ix, iy, -1, 0)) {
        xx = Math.max(xx, ix+r);
    }
    if(tile_is_noentry(ix, iy, +1, 0)) {
        xx = Math.min(xx, ix-r+1);
    }
    if(tile_is_noentry(ix, iy, 0, -1)) {
        yy = Math.max(yy, iy+r);
    }
    if(tile_is_noentry(ix, iy, 0, +1)) {
        yy = Math.min(yy, iy-r+1);
    }
    
    if(tile_is_noentry(ix, iy, -1, -1)) {
        [xx, yy] = xy_bounds([xx, yy], r, [ix, iy]);
    }
    if(tile_is_noentry(ix, iy, -1, +1)) {
        [xx, yy] = xy_bounds([xx, yy], r, [ix, iy+1]);
    }
    if(tile_is_noentry(ix, iy, +1, -1)) {
        [xx, yy] = xy_bounds([xx, yy], r, [ix+1, iy]);
    }
    if(tile_is_noentry(ix, iy, +1, +1)) {
        [xx, yy] = xy_bounds([xx, yy], r, [ix+1, iy+1]);
    }

    return [xx, yy];
};

const pos_fps_movement = (lstick, rstick) => {
    const dt = $listen.timer.deltaTime;

    const cameraXY = ui_value(rstick);
    if(cameraXY) {
        const cameraSpeed = 90; // deg/s
        $pos.ha += cameraSpeed * dt * cameraXY[0];
        $pos.va += cameraSpeed * dt * cameraXY[1];
        $pos.va = Math.max(-60, Math.min($pos.va, 80));
    }

    const moveXY = ui_value(lstick);
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
        [$pos.x, $pos.y] = pos_adjust($pos.x, $pos.y, dx, dy);
    } else {
        [$pos.x, $pos.y] = pos_adjust($pos.x, $pos.y, 0, 0);
    }

    const h = tile_height($pos.x, $pos.y);
    if(Math.abs(h-$pos.h) <= 2) {
        const vh = h - $pos.h;
        $pos.h += 10 * dt * vh;
    } else {
        $pos.h = h;
    }
};

$action["fpsmove"] = (lstick, rstick) => {
    pos_fps_movement(lstick, rstick);
};
