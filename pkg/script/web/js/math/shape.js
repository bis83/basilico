
// Point(3): [x, y, z]
// Sphere(4): [x, y, z, r]
// Segment(6): [x0, y0, z0, x1, y1, z1]
// Capsule(7): [x0, y0, z0, x1, y1, z1, r]
// Plane(4): [a, b, c, d]
// Ray(6): [x, y, z, nx, ny, nz]
// k-DOP(k): [min-0, max-0, min-1, max-1, ... , min-{k/2}, max-{k/2}] AABB(k=6)

const segmentSquareDistance = (segment, p) => {
    const a = [segment[0], segment[1], segment[2]];
    const b = [segment[3], segment[4], segment[5]];
    const ab = vec3sub(b, a);
    const ac = vec3sub(p, a);
    const bc = vec3sub(p, a);
    const t = vec3dot(ac, ab);
    const f = vec3dot(ab, ab);
    if(t <= 0) {
        return vec3dot(ac, ac);
    }
    if(t >= f) {
        return vec3dot(bc, bc);
    }
    return vec3dot(ac, ac) - (t*t/f);
};

const segmentClosestPoint = (segment, p) => {
    const a = [segment[0], segment[1], segment[2]];
    const b = [segment[3], segment[4], segment[5]];
    const ab = vec3sub(b, a);
    const ac = vec3sub(p, a);
    const t = vec3dot(ac, ab);
    const f = vec3dot(ab, ab);
    if(t < 0) {
        return a;
    }
    if(t > f) {
        return b;
    }
    return vec3add(a, vec3mul(ab, t/f));
};

const planeSignedDistance = (plane, p) => {
    return vec3dot(plane, p) - plane[3];
};

const planeClosestPoint = (plane, p) => {
    return vec3sub(p, vec3mul(plane, planeSignedDistance(plane, p)));
};

const DOP6 = [
    [+1,  0,  0],   // [-1,  0,  0]
    [ 0, +1,  0],   // [ 0, -1,  0]
    [ 0,  0, +1],   // [ 0,  0, -1]
];

const DOP8 = [
    [1,  1,  1],    // [-1, -1, -1]
    [1, -1, -1],    // [-1,  1,  1]
    [1, -1,  1],    // [-1, -1,  1]
    [1,  1, -1],    // [-1,  1, -1]
];

const DOP12 = [
    [1, 1, 0],     // [-1,-1, 0]
    [1,-1, 0],     // [-1, 1, 0]
    [1, 0, 1],     // [-1, 0,-1]
    [1, 0,-1],     // [-1, 0, 1]
    [0, 1, 1],     // [ 0,-1,-1]
    [0, 1,-1],     // [ 0,-1, 1]
];
