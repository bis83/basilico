
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
  const data = $dataMob(app, mob.data);
  if (!data) {
    return [0, 0, 0, 0, 0, 0];
  }
  const x = mob.x;
  const y = mob.y;
  const z = mob.z;
  const r = data.radius || 0;
  const h = data.height || 0;
  const m = (data.mass || 0) + 0.01;
  return [x, y, z, r, h, m];
};
