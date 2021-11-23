
const slab_precalc = (pos, dir, slabs) => {
    const v = [];
    for(const n of slabs) {
        const p = vec3dot(n, pos);
        const d = vec3dot(n, dir);
        v.push(p);
        v.push(d);
    }
    return v;
};
const slab = (p, d, min, max) => {
    let t1 = (min - p) / d;
    let t2 = (max - p) / d;
    if(t1 > t2) {
        [t1, t2] = [t2, t1];
    }
    return [t1, t2];
};
const slab_n = (pdir, dop) => {    
    const l = Math.min(pdir.length, dop.length);
    let tmin = 0;
    let tmax = 1;
    for(let i=0; i<l; i+=2) {
        if(Math.abs(pdir[i+1]) <= 0) {
            if(pdir[i] < dop[i] || pdir[i] > dop[i+1]) {
                return null;
            }
        } else {
            const [t1, t2] = slab(pdir[i], pdir[i+1], dop[i], dop[i+1]);
            tmin = Math.max(t1, tmin);
            tmax = Math.min(t2, tmax);
            if(tmin > tmax) {
                return null;
            }
        }
    }
    return tmin;
};

const $data_update_ground_check = (i, pos, dir) => {
    const update = $data_update(i);
    if(!update) {
        return null;
    }
    if(!update.ground) {
        return null;
    }

    if(vec3length(dir) <= 0) {
        return null;
    }
    const v6 = slab_precalc(pos, dir, DOP6);
    const v8 = slab_precalc(pos, dir, DOP8);
    const v12 = slab_precalc(pos, dir, DOP12);

    let tmin = 1;
    const update_tmin = (v, g, k) => {
        const dop = g.b.slice(k, k + v.length);
        const t = slab_n(v, dop);
        if(t === null) {
            return;
        }
        tmin = Math.min(t, tmin);
    };

    for(const g of update.ground) {        
        if(g.dop6) {
            for(const k of g.dop6) {
                update_tmin(v6, g, k);
            }
        }
        if(g.dop8) {
            for(const k of g.dop8) {
                update_tmin(v8, g, k);
            }
        }
        if(g.dop12) {
            for(const k of g.dop12) {
                update_tmin(v12, g, k);
            }
        }
    }

    if(tmin >= 1) {
        return null;
    }
    return tmin;
};
