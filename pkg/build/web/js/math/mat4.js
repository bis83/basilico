
const mat4make = () => {
    return new Float32Array(16);
};

const mat4copy = (o, m) => {
    o.set(m);
};

const mat4identity = (o) => {
    o.set([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);
};

const mat4multiply = (o, m) => {
    const r = [
        o[0]*m[0]+o[1]*m[4]+o[2]*m[8]+o[3]*m[12],
        o[0]*m[1]+o[1]*m[5]+o[2]*m[9]+o[3]*m[13],
        o[0]*m[2]+o[1]*m[6]+o[2]*m[10]+o[3]*m[14],
        o[0]*m[3]+o[1]*m[7]+o[2]*m[11]+o[3]*m[15],
        o[4]*m[0]+o[5]*m[4]+o[6]*m[8]+o[7]*m[12],
        o[4]*m[1]+o[5]*m[5]+o[6]*m[9]+o[7]*m[13],
        o[4]*m[2]+o[5]*m[6]+o[6]*m[10]+o[7]*m[14],
        o[4]*m[3]+o[5]*m[7]+o[6]*m[11]+o[7]*m[15],
        o[8]*m[0]+o[9]*m[4]+o[10]*m[8]+o[11]*m[12],
        o[8]*m[1]+o[9]*m[5]+o[10]*m[9]+o[11]*m[13],
        o[8]*m[2]+o[9]*m[6]+o[10]*m[10]+o[11]*m[14],
        o[8]*m[3]+o[9]*m[7]+o[10]*m[11]+o[11]*m[15],
        o[12]*m[0]+o[13]*m[4]+o[14]*m[8]+o[15]*m[12],
        o[12]*m[1]+o[13]*m[5]+o[14]*m[9]+o[15]*m[13],
        o[12]*m[2]+o[13]*m[6]+o[14]*m[10]+o[15]*m[14],
        o[12]*m[3]+o[13]*m[7]+o[14]*m[11]+o[15]*m[15]
    ];
    o.set(r);
};

const mat4translate = (o, x, y, z) => {
    o.set([
        1, 0, 0, x,
        0, 1, 0, y,
        0, 0, 1, z,
        0, 0, 0, 1
    ]);
};

const mat4scale = (o, x, y, z) => {
    o.set([
        x, 0, 0, 0,
        0, y, 0, 0,
        0, 0, z, 0,
        0, 0, 0, 1
    ]);
};

const mat4lookat = (o, eye, at, up) => {
    const tz = vec3make();
    vec3sub(tz, at, eye);
    vec3normalize(tz);
    const tx = vec3make();
    vec3cross(tx, up, tz);
    vec3normalize(tx);
    const ty = vec3make();
    vec3cross(ty, tz, tx);
    const dx = vec3dot(eye, tx);
    const dy = vec3dot(eye, ty);
    const dz = vec3dot(eye, tz);
    o.set([
        tx[0], ty[0], tz[0], 0,
        tx[1], ty[1], tz[1], 0,
        tx[2], ty[2], tz[2], 0,
          -dx,   -dy,   -dz, 1
    ]);
};

const mat4perspective = (o, fovy, aspect, near, far) => {
    const sy = 1 / Math.tan(fovy);
    const sx = sy / aspect;
    const sz = far / (far - near);
    const wz = -(sz * near);
    o.set([
        sx,  0,  0, 0,
         0, sy,  0, 0,
         0,  0, sz, 1,
         0,  0, wz, 0
    ]);
};

const mat4ortho = (o, w, h, zn, zf) => {
    const sx = 2 / w;
    const sy = 2 / h;
    const sz = 1 / (zf - zn);
    const wz = zn / (zn - zf);
    o.set([
        sx,  0,  0, 0,
         0, sy,  0, 0,
         0,  0, sz, 0,
         0,  0, wz, 1
    ]);
};
