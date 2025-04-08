
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
