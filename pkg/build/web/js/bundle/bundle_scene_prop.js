
const makeScenePropLoader = () => {
    // loader
    const map = {};
    const get = (name) => {
        return map[name];
    };
    const load = (name, data) => {
        map[name] = [];
        if(!data) {
            return;
        }
        for(let p of data) {
            const obj = {
                mesh: p.mesh,
                matrix: p.matrix ? base64ToFloat32Array(p.matrix) : null,
                aabb: p.aabb ? base64ToFloat32Array(p.aabb) : null,
            };
            map[name].push(obj);
        }
    };
    return {
        load: load,
        get: get,
    };
};
