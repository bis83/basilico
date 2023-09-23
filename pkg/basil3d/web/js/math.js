
const div = (v, n) => {
  return Math.floor(v / n);
};

const mod = (v, n) => {
  return ((v % n) + n) % n;
};

const deg2rad = (deg) => {
  return (deg / 180) * Math.PI;
};

const xy_length = (x, y) => {
  return Math.sqrt(x * x + y * y);
};

const xy_normalize = (x, y) => {
  const l = xy_length(x, y);
  return l != 0 ? [x / l, y / l] : [0, 0];
};

const xy_reverse = ([x, y]) => {
  return [-x, -y];
};

const xy_mul = ([x, y], l) => {
  return [x * l, y * l];
};

const xy_hit_rect = ([x, y], minX, maxX, minY, maxY) => {
  return (minX <= x) && (x <= maxX) && (minY <= y) && (y <= maxY);
};

const xy_bounds = ([x0, y0], r, [x1, y1]) => {
  const [dx, dy] = [x1 - x0, y1 - y0];
  const l = xy_length(dx, dy);
  if (r <= l) {
    return [x0, y0];
  }
  const [nx, ny] = xy_normalize(dx, dy);
  const [sx, sy] = xy_mul([nx, ny], l - r);
  return [x0 + sx, y0 + sy];
};

const vec3dot = (a, b) => {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};

const vec3length = (a) => {
  const d = vec3dot(a, a);
  return Math.sqrt(d);
};

const vec3add = (a, b) => {
  return [
    a[0] + b[0],
    a[1] + b[1],
    a[2] + b[2]
  ];
};

const vec3sub = (a, b) => {
  return [
    a[0] - b[0],
    a[1] - b[1],
    a[2] - b[2]
  ];
};

const vec3mul = (v, x) => {
  return [
    v[0] * x,
    v[1] * x,
    v[2] * x
  ];
};

const vec3normalize = (v) => {
  const l = vec3length(v);
  return [
    v[0] / l,
    v[1] / l,
    v[2] / l
  ];
};

const vec3cross = (a, b) => {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ];
};

const vec3dir = (hang, vang) => {
  const h = deg2rad(hang);
  const v = deg2rad(vang);
  return [
    Math.cos(v) * Math.cos(h),
    Math.sin(v),
    Math.cos(v) * Math.sin(h),
  ];
};

const mat4identity = () => {
  return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ];
};

const mat4multiply = (a, b) => {
  return [
    a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12],
    a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13],
    a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14],
    a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15],
    a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12],
    a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13],
    a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14],
    a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15],
    a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12],
    a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13],
    a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14],
    a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15],
    a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12],
    a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13],
    a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14],
    a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15]
  ];
};

const mat4invert = (a) => {
  const b00 = a[0] * a[5] - a[1] * a[4];
  const b01 = a[0] * a[6] - a[2] * a[4];
  const b02 = a[0] * a[7] - a[3] * a[4];
  const b03 = a[1] * a[6] - a[2] * a[5];
  const b04 = a[1] * a[7] - a[3] * a[5];
  const b05 = a[2] * a[7] - a[3] * a[6];
  const b06 = a[8] * a[13] - a[9] * a[12];
  const b07 = a[8] * a[14] - a[10] * a[12];
  const b08 = a[8] * a[15] - a[11] * a[12];
  const b09 = a[9] * a[14] - a[10] * a[13];
  const b10 = a[9] * a[15] - a[11] * a[13];
  const b11 = a[10] * a[15] - a[11] * a[14];
  let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  if (!det) {
    return mat4identity();
  }
  det = 1.0 / det;
  return [
    (a[5] * b11 - a[6] * b10 + a[7] * b09) * det,
    (a[2] * b10 - a[1] * b11 - a[3] * b09) * det,
    (a[13] * b05 - a[14] * b04 + a[15] * b03) * det,
    (a[10] * b04 - a[9] * b05 - a[11] * b03) * det,
    (a[6] * b08 - a[4] * b11 - a[7] * b07) * det,
    (a[0] * b11 - a[2] * b08 + a[3] * b07) * det,
    (a[14] * b02 - a[12] * b05 - a[15] * b01) * det,
    (a[8] * b05 - a[10] * b02 + a[11] * b01) * det,
    (a[4] * b10 - a[5] * b08 + a[7] * b06) * det,
    (a[1] * b08 - a[0] * b10 - a[3] * b06) * det,
    (a[12] * b04 - a[13] * b02 + a[15] * b00) * det,
    (a[9] * b02 - a[8] * b04 - a[11] * b00) * det,
    (a[5] * b07 - a[4] * b09 - a[6] * b06) * det,
    (a[0] * b09 - a[1] * b07 + a[2] * b06) * det,
    (a[13] * b01 - a[12] * b03 - a[14] * b00) * det,
    (a[8] * b03 - a[9] * b01 + a[10] * b00) * det
  ];
};

const mat4translate = (x, y, z) => {
  return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    x, y, z, 1
  ];
};

const mat4translated = (m, x, y, z) => {
  m[12] = x;
  m[13] = y;
  m[14] = z;
};

const mat4angle = (ha, va) => {
  const h = deg2rad(ha);
  const sinH = Math.sin(h);
  const cosH = Math.cos(h);
  // const v = deg2rad(va);
  return [
    cosH, 0, sinH, 0,
    0, 1, 0, 0,
    -sinH, 0, cosH, 0,
    0, 0, 0, 1,
  ];
};

const mat4scale = (x, y, z) => {
  return [
    x, 0, 0, 0,
    0, y, 0, 0,
    0, 0, z, 0,
    0, 0, 0, 1
  ];
};

const mat4lookat = (eye, at, up) => {
  const tz = vec3normalize(vec3sub(at, eye));
  const tx = vec3normalize(vec3cross(up, tz));
  const ty = vec3cross(tz, tx);
  const dx = vec3dot(eye, tx);
  const dy = vec3dot(eye, ty);
  const dz = vec3dot(eye, tz);
  return [
    tx[0], ty[0], tz[0], 0,
    tx[1], ty[1], tz[1], 0,
    tx[2], ty[2], tz[2], 0,
    -dx, -dy, -dz, 1
  ];
};

const mat4perspective = (fovy, aspect, near, far) => {
  const sy = 1 / Math.tan(fovy);
  const sx = sy / aspect;
  const sz = far / (far - near);
  const wz = -(sz * near);
  return [
    sx, 0, 0, 0,
    0, sy, 0, 0,
    0, 0, sz, 1,
    0, 0, wz, 0
  ];
};

const mat4ortho = (w, h, zn, zf) => {
  const sx = 2 / w;
  const sy = 2 / h;
  const sz = 1 / (zf - zn);
  const wz = zn / (zn - zf);
  return [
    sx, 0, 0, 0,
    0, sy, 0, 0,
    0, 0, sz, 0,
    0, 0, wz, 1
  ];
};
