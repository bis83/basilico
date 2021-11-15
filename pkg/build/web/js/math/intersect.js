
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

const intersectSphereToKDOP = (a, b) => {
    // TODO:
    return false;
};

const intersectCapsuleToCapsule = (a, b) => {
    // TODO:
    return false;
};

const intersectCapsuleToKDOP = (a, b) => {
    // TODO:
    return false;
};

const intersectKDOPToKDOP = (a, b) => {
    const l = Math.min(a.length, b.length);
    for(let i=0; i<l; i+=2) {
        if(a[i+0] > b[i+1] || a[i+1] < b[i+0]) {
            return false;
        }
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
