
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
        for(let item of data) {
            const obj = {
                mesh: item.mesh,
                matrix: item.matrix ? base64ToFloat32Array(item.matrix) : null,
                aabb: item.aabb ? base64ToFloat32Array(item.aabb) : null,
            };
            map[name].push(obj);
        }
    };
    return {
        load: load,
        get: get,
    };
};
