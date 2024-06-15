
const $getOffset = (offset, x, y, z, ha, va) => {
  if (offset) {
    x += offset.x || 0;
    y += offset.y || 0;
    z += offset.z || 0;
    ha += offset.ha || 0;
    va += offset.va || 0;
  }
  return [x, y, z, ha, va];
};

const $getColor = (color, r, g, b, a) => {
  if (color) {
    if (defined(color.r)) {
      r = color.r;
    }
    if (defined(color.g)) {
      g = color.g;
    }
    if (defined(color.r)) {
      b = color.b;
    }
    if (defined(color.a)) {
      a = color.a;
    }
  }
  return [r, g, b, a];
};

const $mobShape = (app, mob) => {
  const data = $mob(app, mob.data);
  if (!data) {
    return [0, 0, 0, 0, 0, 0];
  }
  const x = mob.offset ? (mob.offset.x || 0) : 0;
  const y = mob.offset ? (mob.offset.y || 0) : 0;
  const z = mob.offset ? (mob.offset.z || 0) : 0;
  const r = data.radius || 0;
  const h = data.height || 0;
  const m = (data.mass || 0) + 0.01;
  return [x, y, z, r, h, m];
};
