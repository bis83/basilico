
// {{ if .Logging }}
const LOG = (...args) => {
    console.log(...args);
};
// {{ else }}
const LOG = (...args) => {
};
// {{ end }}

const makeMat44 = () => {
    return new Float32Array(16);
};
const cloneMat44 = (o, m) => {
    o.set(m);
};
const identityMat44 = (o) => {
    o.set([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);
};
const multiplyMat44 = (o, m) => {
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
const inverseMat44 = (o) => {
    // TODO:
};
const translateMat44 = (o, x, y, z) => {
    o.set([
        1, 0, 0, x,
        0, 1, 0, y,
        0, 0, 1, z,
        0, 0, 0, 1
    ]);
};
