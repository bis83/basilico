
const makeCoreUserConfig = () => {
    const load = (json) => {
    };
    const save = () => {
    };
    return {
        load: load,
        save: save,
    };
};

const makeCoreUserProgress = () => {
    let scene = "";
    const angle = [90, 0];
    const pos = vec3make();
    vec3set(pos, 0, 0, 0);

    const load = (json) => {
    };
    const save = () => {
    };
    return {
        load: load,
        save: save,
        // getter
        scene: () => scene,
        position: () => pos,
        angle: () => angle,
        // setter
        setScene: (name) => { scene = name; },
        setPosition: (x, y, z) => vec3set(pos, x, y, z),
        setAngle: (x, y) => { angle[0] = x; angle[1] = y; },
    };
};

const makeCoreUserData = () => {
    const load = (key, defaultValue) => {
        const data = localStorage.getItem("key");
        if(data == null) {
            return defultValue;
        }
        return JSON.parse(data);
    };
    const save = (key, data) => {
        const json = JSON.stringify(data);
        localStorage.setItem(key, json);
    };
    const del = (key) => {
        localStorage.removeItem(key);
    };

    let conf = makeCoreUserConfig();
    let prog = makeCoreUserProgress();
    return {
        conf: () => conf,
        prog: () => prog,
    }
};
