
const makeUpdateLoader = () => {
    const map = {};
    const get = (name) => {
        return map[name];
    };
    const load = (data) => {
    };
    return {
        load: load,
        get: get,
    };
};
