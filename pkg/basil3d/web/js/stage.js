
const $__exec = {};

const $__stageStep = (app) => {
  const stage = $stageCurrent(app);
  if (!stage) {
    return;
  }
  const data = $stage(app, stage.data);
  if (!data) {
    return;
  }
  const items = data.step || [];
  const goto = (to) => {
    for (let i = 0; i < items.length; ++i) {
      if (items[i].label && items[i].label === to) {
        return i;
      }
    }
    return -1;
  };

  let yield = false;
  while (!yield) {
    const step = items[stage.step];
    if (step) {
      if (step.event) {
        const func = $__exec[step.event];
        if (func) {
          func(app);
        }
      }
      if (step.solve) {
        $__stageSolve(app);
      }
      if (step.goto) {
        stage.step = goto(step.goto);
      } else {
        stage.step += 1;
      }
      if (step.yield) {
        yield = true;
      }
    } else {
      stage.step = -1;
      yield = true;
    }
  }
  if (stage.step < 0) {
    app.stage.pop();
  }
};

const $__stageNew = (app, name) => {
  const data = $stage(app, name);
  if (!data) {
    return;
  }
  const stage = {
    data: name,
    step: 0,
    room: structuredClone(data.room) || [],
    mob: structuredClone(data.mob) || [],
    camera: structuredClone(data.camera[0]),
    light: structuredClone(data.light[0]),
  };
  app.stage.push(stage);
};

const $__stageSolve = (app) => {
  const mobs = $stageCurrent(app).mob;
  for (let i = 0; i < mobs.length; ++i) {
    for (let j = i + 1; j < mobs.length; ++j) {
      $__stageSolveMob2Mob(app, mobs[i], mobs[j]);
    }
  }
  const rooms = $stageCurrent(app).room;
  for (let i = 0; i < mobs.length; ++i) {
    for (let j = 0; j < rooms.length; ++j) {
      $__stageSolveMob2Room(app, mobs[i], rooms[j]);
    }
  }
};

const $__stageSolveMob2Mob = (app, a, b) => {
  const [x0, y0, z0, r0, h0, m0] = $mobShape(app, a);
  const [x1, y1, z1, r1, h1, m1] = $mobShape(app, b);

  if (y0 + h0 <= y1 || y1 + h1 <= y0) {
    return;
  }
  const d = xy_length(x1 - x0, z1 - z0) - (r0 + r1);
  if (d >= 0) {
    return;
  }

  const w = m0 / (m0 + m1);
  const [nx, nz] = xy_normalize(x1 - x0, z1 - z0);
  a.offset.x = x0 + d * nx * w;
  a.offset.z = z0 + d * nz * w;
  b.offset.x = x1 - d * nx * (1 - w);
  b.offset.z = z1 - d * nz * (1 - w);
};

const $__stageSolveMob2Room = (app, a, b) => {
  const [x0, y0, z0, r0, h0, m0] = $mobShape(app, a);

  const data = $room(app, b.data);
  if (!data) {
    return;
  }
  const x = b.offset ? (b.offset.x || 0) : 0;
  const y = b.offset ? (b.offset.y || 0) : 0;
  const z = b.offset ? (b.offset.z || 0) : 0;
  for (const layout of data.layout) {
    const i = Math.round((x0 - x) / layout.unit);
    const j = Math.round((z0 - z) / layout.unit);
    const idx = i + j * layout.divisor;
    if (layout.indices.length <= idx) {
      continue;
    }
    const node = layout.node[layout.indices[idx]];
    if (!node) {
      continue;
    }
    const h = node.height || 0;
    a.offset.y = h;
  }
};
