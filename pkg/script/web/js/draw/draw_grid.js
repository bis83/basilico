
const draw_tile = (x, y) => {
  const tile = grid_tile(x, y);
  if (!tile) {
    return;
  }

  // base
  for (let i = 0; i < tile.base.length; ++i) {
    const data = data_base(tile.base[i]);
    if (!data) {
      continue;
    }
    draw_call(data.draw, (u) => {
      const pos = grid_to_world(x, y, i);
      $view.m.set(mat4translate(pos[0], pos[1], pos[2]));
      $gl.uniformMatrix4fv(u.w, false, $view.m);
    });
  }

  // tile
  const data = data_tile(tile.no);
  if (!data) {
    return;
  }
  const h = tile_height(tile);
  draw_call(data.draw, (u) => {
    const pos = grid_to_world(x, y, h);
    const m = mat4angle(tile.ha || 0, tile.va || 0);
    mat4translated(m, pos[0] + 1, pos[1] + 1, pos[2]);
    $view.m.set(m);
    $gl.uniformMatrix4fv(u.w, false, $view.m);
  });
};

const draw_mob = (mob) => {
  const data = data_mob(mob.no);
  if (!data) {
    return;
  }
  if (data.draw <= 0) {
    return;
  }
  draw_call(data.draw, (u) => {
    const pos = grid_to_world(mob.x, mob.y, mob.h);
    const m = mat4angle(mob.ha || 0, mob.va || 0);
    mat4translated(m, pos[0] + 1, pos[1] + 1, pos[2]);
    $view.m.set(m);
    $gl.uniformMatrix4fv(u.w, false, $view.m);
  });
};

const draw_grid = () => {
  for (let x = 0; x < $grid.w; ++x) {
    for (let y = 0; y < $grid.h; ++y) {
      draw_tile(x, y);
    }
  }
  for (const mob of $grid.m) {
    draw_mob(mob);
  }
};
