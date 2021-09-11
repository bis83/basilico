
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
        for(let p of data) {
            map[name].push({});
        }
    };
    return {
        load: load,
        get: get,
    };
};
