
const makeCoreScene = () => {
    let current = null;
    const scenes = {};
    const loadProp = (name, props) => {
        if(!scenes[name]) {
            scenes[name] = {};
        }
        scenes[name].prop = [];
        for(let p of props) {
            const data = {
                mesh: p.mesh,
                matrix: p.matrix ? base64ToFloat32Array(p.matrix) : null,
                aabb: p.aabb ? base64ToFloat32Array(p.aabb) : null,
            };
            scenes[name].prop.push(data);
        }
    };
    const change = (name) => {
        current = name;
    };
    const get = () => {
        if(!current) {
            return null;
        }
        return scenes[current];
    };
    return {
        loadProp: loadProp,
        change: change,
        get: get,
    };
};
