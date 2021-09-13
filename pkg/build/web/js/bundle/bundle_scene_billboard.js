
const makeSceneBillboardLoader = () => {
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
                texture: item.texture,
                matrix: item.matrix ? base64ToFloat32Array(item.matrix) : null,
                is_ortho: item.is_ortho,
                is_pause: item.is_pause,
            };
            map[name].push(obj);
        }
    };
    return {
        load: load,
        get: get,
    };
};
