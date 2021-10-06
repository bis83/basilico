
const makeDrawLoader = () => {
    // loader
    const map = {};
    const get = (name) => {
        return map[name];
    };
    const load = (data) => {
        const loadOne = (data) => {
            const obj = {};
            if(data.prop) {
                const prop = [];
                for(let item of data.prop) {
                    prop.push({
                        mesh: item.mesh,
                        matrix: item.matrix ? base64ToFloat32Array(item.matrix) : null,
                    });
                }
                obj.prop = prop;
            }
            map[data.name] = obj;
        };
        if(!data) {
            return;
        }
        for(let item of data) {
            loadOne(item);
        }
    };
    return {
        load: load,
        get: get,
    };
};
