
const mob_make = (no, x, y, h, ha, va) => {
  return {
    no: no,
    x: x,
    y: y,
    h: h,
    ha: ha || 0,
    va: va || 0,
  };
};

const mob_tick = (mob) => {
  const data = data_mob(mob.no);
  if (!data) {
    return;
  }
  if (data.action) {
    action_invoke(mob, data.action);
  }
  mob_fall(mob);
};

const mob_fall = (mob) => {
  const h = tile_height(grid_tile(mob.x, mob.y));
  if (Math.abs(h - mob.h) <= 2) {
    const dt = $timer.dt;
    const vh = h - mob.h;
    mob.h += 10 * dt * vh;
  } else {
    mob.h = h;
  }
};

const mob_adjust_position = (r, x, y, dx, dy) => {
  const ix = Math.floor(x);
  const iy = Math.floor(y);

  const h0 = tile_height(grid_tile(ix, iy));

  let xx = x + dx;
  let yy = y + dy;
  if (tile_is_noentry(grid_tile(ix - 1, iy), h0)) {
    xx = Math.max(xx, ix + r);
  }
  if (tile_is_noentry(grid_tile(ix + 1, iy), h0)) {
    xx = Math.min(xx, ix - r + 1);
  }
  if (tile_is_noentry(grid_tile(ix, iy - 1), h0)) {
    yy = Math.max(yy, iy + r);
  }
  if (tile_is_noentry(grid_tile(ix, iy + 1), h0)) {
    yy = Math.min(yy, iy - r + 1);
  }

  if (tile_is_noentry(grid_tile(ix - 1, iy - 1), h0)) {
    [xx, yy] = xy_bounds([xx, yy], r, [ix, iy]);
  }
  if (tile_is_noentry(grid_tile(ix - 1, iy + 1), h0)) {
    [xx, yy] = xy_bounds([xx, yy], r, [ix, iy + 1]);
  }
  if (tile_is_noentry(grid_tile(ix + 1, iy - 1), h0)) {
    [xx, yy] = xy_bounds([xx, yy], r, [ix + 1, iy]);
  }
  if (tile_is_noentry(grid_tile(ix + 1, iy + 1), h0)) {
    [xx, yy] = xy_bounds([xx, yy], r, [ix + 1, iy + 1]);
  }

  return [xx, yy];
};

const mob_fps_movement = (mob, moveXY, cameraXY) => {
  const data = data_mob(mob.no);
  if (!data) {
    return;
  }

  const dt = $timer.dt;
  if (cameraXY) {
    const cameraSpeed = 90; // deg/s
    mob.ha += cameraSpeed * dt * cameraXY[0];
    mob.va += cameraSpeed * dt * cameraXY[1];
    mob.va = Math.max(-60, Math.min(mob.va, 80));
  }
  if (moveXY) {
    const moveSpeed = 2;    // cell/s
    const rx = deg2rad(mob.ha + 90);
    const ry = deg2rad(mob.ha);
    const moveX = moveXY[0];
    const moveY = moveXY[1];
    const vx = moveX * Math.cos(rx) + moveY * Math.cos(ry);
    const vy = moveX * Math.sin(rx) + moveY * Math.sin(ry);
    const dx = moveSpeed * dt * vx;
    const dy = moveSpeed * dt * vy;
    [mob.x, mob.y] = mob_adjust_position(data.r, mob.x, mob.y, dx, dy);
  } else {
    [mob.x, mob.y] = mob_adjust_position(data.r, mob.x, mob.y, 0, 0);
  }
};

const mob_resolve_overlaps = (mobs) => {
  for (let i = 0; i < mobs.length; ++i) {
    for (let j = i + 1; j < mobs.length; ++j) {
      const a = mobs[i];
      const b = mobs[j];
      const adata = data_mob(a.no);
      if (!adata) {
        continue;
      }
      const bdata = data_mob(b.no);
      if (!bdata) {
        continue;
      }
      const [dx, dy] = [b.x - a.x, b.y - a.y];
      const l = xy_length(dx, dy);
      const d = (adata.r + bdata.r) - l;
      if (d <= 0) {
        continue;
      }
      const ab = xy_normalize(dx, dy);
      const ba = xy_reverse(ab);
      const wa = (adata.w == 0 && bdata.w == 0) ? 0.5 : (adata.w / (adata.w + bdata.w));
      const wb = 1 - wa;
      [a.x, a.y] = mob_adjust_position(adata.r, a.x, a.y, ba[0] * wa * d, ba[1] * wa * d);
      [b.x, b.y] = mob_adjust_position(bdata.r, b.x, b.y, ab[0] * wb * d, ab[1] * wb * d);
    }
  }
};
