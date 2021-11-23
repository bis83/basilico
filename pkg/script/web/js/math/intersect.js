
// intersect

const not_intersect = (min0, max0, min1, max1) => {
    return (max0 < min1) || (min0 > max1);
};
const not_intersect_n = (v0, v1, k) => {
    for(let i=0; i<k; i+=2) {
        if(not_intersect(v0[i], v0[i+1], v1[i], v1[i+1])) {
            return false;
        }
    }
    return true;
};

// Sphere

const intersectSphereToSphere = (a, b) => {
    const d = vec3sub(a, b);
    const d2 = vec3dot(d, d);
    const r = a[3] + b[3];
    return d2 <= (r*r);
};

const intersectSphereToCapsule = (a, b) => {
    const d2 = segmentSquareDistance(a, b);
    const r = a[3] + b[6];
    return d2 <= r*r;
};

const intersectCapsuleToCapsule = (a, b) => {
    // TODO:
    return false;
};

const intersectKDOPToKDOP = (a, b) => {
    const l = Math.min(a.length, b.length);
    if(not_intersect_n(a, b, l)) {
        return false;
    }
    return true;
};

const insideSphereToHalfSpace = (a, b) => {
    const d = planeSignedDistance(b, a);
    return d <= a[3];
};

const insideCapsuleToHalfSpace = (a, b) => {
    const p = [a[0], a[1], a[2]];
    const q = [a[3], a[4], a[5]];
    const d1 = planeSignedDistance(b, p);
    const d2 = planeSignedDistance(b, q);
    if(d1 < 0 || d2 < 0) {
        return true;
    }
    return Math.min(d1, d2) <= a[6];
};
