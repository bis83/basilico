
const vec3make = () => {
    return new Float32Array(3);
};

const vec3dot = (a, b) => {
    return a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
};

const vec3length = (a) => {
    return Math.sqrt(vec3dot(a, a));
};

const vec3copy = (o, a) => {
    o.set(a);
};

const vec3zero = (o) => {
    o.set([0, 0, 0]);
};

const vec3set = (o, x, y, z) => {
    o.set([x, y, z]);
};

const vec3add = (o, a, b) => {
    o.set([
        a[0] + b[0],
        a[1] + b[1],
        a[2] + b[2]
    ]);
};

const vec3sub = (o, a, b) => {
    o.set([
        a[0] - b[0],
        a[1] - b[1],
        a[2] - b[2]
    ]);
};

const vec3normalize = (o) => {
    const l = vec3length(o);
    o.set([
        o[0] / l,
        o[1] / l,
        o[2] / l
    ]);
};

const vec3cross = (o, a, b) => {
    o.set([
        a[1]*b[2] - a[2]*b[1],
        a[2]*b[0] - a[0]*b[2],
        a[0]*b[1] - a[1]*b[0]
    ]);
};

const vec3dir = (o, hang, vang) => {
    const h = deg2rad(hang);
    const v = deg2rad(vang);
    o.set([
        Math.cos(v) * Math.cos(h),
        Math.sin(v),
        Math.cos(v) * Math.sin(h)
    ]);
};
