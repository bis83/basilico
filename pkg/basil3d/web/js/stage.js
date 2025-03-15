
const $__exec = {};

const $__stageStep = (app) => {
  const stage = $stageCurrent(app);
  if (!stage) {
    return;
  }
  const data = $dataStage(app, stage.data);
  if (!data) {
    return;
  }
  const exec = $__exec[stage.data] || {};
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
        const func = exec[step.event];
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
  const data = $dataStage(app, name);
  if (!data) {
    return;
  }
  const stage = {
    data: name,
    step: 0,
    room: [],
    mob: [],
    camera: {},
    light: {},
  };
  if (data.entity) {
    for (const e of data.entity) {
      if (e.room) {
        stage.room.push(structuredClone(e.room))
      }
      if (e.mob) {
        stage.mob.push(structuredClone(e.mob))
      }
      if (e.camera) {
        stage.camera = structuredClone(e.camera)
      }
      if (e.light) {
        stage.light = structuredClone(e.light)
      }
    }
  }
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
  a.x = x0 + d * nx * w;
  a.z = z0 + d * nz * w;
  b.x = x1 - d * nx * (1 - w);
  b.z = z1 - d * nz * (1 - w);
};

const $__stageSolveMob2Room = (app, a, b) => {
  const [x0, y0, z0, r0, h0, m0] = $mobShape(app, a);

  const data = $dataRoom(app, b.data);
  if (!data) {
    return;
  }
  const x = b.x;
  const y = b.y;
  const z = b.z;
  for (const layout of data.layout) {
    const height = (i, j) => {
      if (i < 0 || j < 0 || layout.divisor <= i) {
        return 0;
      }
      const idx = i + j * layout.divisor;
      if (layout.indices.length <= idx) {
        return 0;
      }
      const node = layout.node[layout.indices[idx]];
      if (!node) {
        return 0;
      }
      return y + (node.height || 0);
    };

    // adjust y
    const i = Math.round((x0 - x) / layout.unit);
    const j = Math.round((z0 - z) / layout.unit);
    const h = height(i, j);
    a.y = h;

    // adjust x/z
    const he = height(i - 1, j);
    const hw = height(i + 1, j);
    const hs = height(i, j - 1);
    const hn = height(i, j + 1);
    const x1 = x + i * layout.unit;
    const z1 = z + j * layout.unit;
    const u = layout.unit;
    const u2 = u / 2 - r0;
    a.x = clamp(x0,
      Math.abs(he - h) <= 0.5 ? x1 - u : x1 - u2,
      Math.abs(hw - h) <= 0.5 ? x1 + u : x1 + u2);
    a.z = clamp(z0,
      Math.abs(hs - h) <= 0.5 ? z1 - u : z1 - u2,
      Math.abs(hn - h) <= 0.5 ? z1 + u : z1 + u2);
  }
};
