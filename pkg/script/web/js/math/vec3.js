
const vec3dot = (a, b) => {
    return a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
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
        a[1]*b[2] - a[2]*b[1],
        a[2]*b[0] - a[0]*b[2],
        a[0]*b[1] - a[1]*b[0]
    ];
};

const vec3dir = (hang, vang) => {
    const h = deg2rad(hang);
    const v = deg2rad(vang);
    return [
        Math.cos(v) * Math.cos(h),
        Math.sin(v),
        Math.cos(v) * Math.sin(h)
    ];
};
