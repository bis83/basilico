
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
        a[ 0]*b[0] + a[ 1]*b[4] + a[ 2]*b[ 8] + a[ 3]*b[12],
        a[ 0]*b[1] + a[ 1]*b[5] + a[ 2]*b[ 9] + a[ 3]*b[13],
        a[ 0]*b[2] + a[ 1]*b[6] + a[ 2]*b[10] + a[ 3]*b[14],
        a[ 0]*b[3] + a[ 1]*b[7] + a[ 2]*b[11] + a[ 3]*b[15],
        a[ 4]*b[0] + a[ 5]*b[4] + a[ 6]*b[ 8] + a[ 7]*b[12],
        a[ 4]*b[1] + a[ 5]*b[5] + a[ 6]*b[ 9] + a[ 7]*b[13],
        a[ 4]*b[2] + a[ 5]*b[6] + a[ 6]*b[10] + a[ 7]*b[14],
        a[ 4]*b[3] + a[ 5]*b[7] + a[ 6]*b[11] + a[ 7]*b[15],
        a[ 8]*b[0] + a[ 9]*b[4] + a[10]*b[ 8] + a[11]*b[12],
        a[ 8]*b[1] + a[ 9]*b[5] + a[10]*b[ 9] + a[11]*b[13],
        a[ 8]*b[2] + a[ 9]*b[6] + a[10]*b[10] + a[11]*b[14],
        a[ 8]*b[3] + a[ 9]*b[7] + a[10]*b[11] + a[11]*b[15],
        a[12]*b[0] + a[13]*b[4] + a[14]*b[ 8] + a[15]*b[12],
        a[12]*b[1] + a[13]*b[5] + a[14]*b[ 9] + a[15]*b[13],
        a[12]*b[2] + a[13]*b[6] + a[14]*b[10] + a[15]*b[14],
        a[12]*b[3] + a[13]*b[7] + a[14]*b[11] + a[15]*b[15]
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
          -dx,   -dy,   -dz, 1
    ];
};

const mat4perspective = (fovy, aspect, near, far) => {
    const sy = 1 / Math.tan(fovy);
    const sx = sy / aspect;
    const sz = far / (far - near);
    const wz = -(sz * near);
    return [
        sx,  0,  0, 0,
         0, sy,  0, 0,
         0,  0, sz, 1,
         0,  0, wz, 0
    ];
};

const mat4ortho = (w, h, zn, zf) => {
    const sx = 2 / w;
    const sy = 2 / h;
    const sz = 1 / (zf - zn);
    const wz = zn / (zn - zf);
    return [
        sx,  0,  0, 0,
         0, sy,  0, 0,
         0,  0, sz, 0,
         0,  0, wz, 1
    ];
};
