
const pos_adjust = (x, y, dx, dy) => {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const r = 0.25;

    const h0 = tile_height(grid_tile(ix, iy));

    let xx = x + dx;
    let yy = y + dy;
    if(tile_is_noentry(grid_tile(ix-1, iy), h0)) {
        xx = Math.max(xx, ix+r);
    }
    if(tile_is_noentry(grid_tile(ix+1, iy), h0)) {
        xx = Math.min(xx, ix-r+1);
    }
    if(tile_is_noentry(grid_tile(ix, iy-1), h0)) {
        yy = Math.max(yy, iy+r);
    }
    if(tile_is_noentry(grid_tile(ix, iy+1), h0)) {
        yy = Math.min(yy, iy-r+1);
    }
    
    if(tile_is_noentry(grid_tile(ix-1, iy-1), h0)) {
        [xx, yy] = xy_bounds([xx, yy], r, [ix, iy]);
    }
    if(tile_is_noentry(grid_tile(ix-1, iy+1), h0)) {
        [xx, yy] = xy_bounds([xx, yy], r, [ix, iy+1]);
    }
    if(tile_is_noentry(grid_tile(ix+1, iy-1), h0)) {
        [xx, yy] = xy_bounds([xx, yy], r, [ix+1, iy]);
    }
    if(tile_is_noentry(grid_tile(ix+1, iy+1), h0)) {
        [xx, yy] = xy_bounds([xx, yy], r, [ix+1, iy+1]);
    }

    return [xx, yy];
};

const mob_fps_movement = (mob, moveXY, cameraXY) => {
    const dt = $timer.dt;
    if(cameraXY) {
        const cameraSpeed = 90; // deg/s
        mob.ha += cameraSpeed * dt * cameraXY[0];
        mob.va += cameraSpeed * dt * cameraXY[1];
        mob.va = Math.max(-60, Math.min(mob.va, 80));
    }
    if(moveXY) {
        const moveSpeed = 2;    // cell/s
        const rx = deg2rad(mob.ha+90);
        const ry = deg2rad(mob.ha);
        const moveX = moveXY[0];
        const moveY = moveXY[1];
        const vx = moveX * Math.cos(rx) + moveY * Math.cos(ry);
        const vy = moveX * Math.sin(rx) + moveY * Math.sin(ry);
        const dx = moveSpeed * dt * vx;
        const dy = moveSpeed * dt * vy;
        [mob.x, mob.y] = pos_adjust(mob.x, mob.y, dx, dy);
    } else {
        [mob.x, mob.y] = pos_adjust(mob.x, mob.y, 0, 0);
    }
    const h = tile_height(grid_tile(mob.x, mob.y));
    if(Math.abs(h-mob.h) <= 2) {
        const vh = h - mob.h;
        mob.h += 10 * dt * vh;
    } else {
        mob.h = h;
    }
};

define_action("fpsmove", (self, lstick, rstick) => {
    const moveXY = com_value(lstick);
    const cameraXY = com_value(rstick);
    mob_fps_movement(self, moveXY, cameraXY);
});
