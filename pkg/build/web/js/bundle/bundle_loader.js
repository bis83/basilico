
const makeBundleLoader = (graphics, scene) => {
    const loadMesh = (mesh) => {
        if(!mesh) {
            return;
        }
        for(let m of mesh) {
            graphics.mesh.loadMesh(m);
        }
    };
    const loadProp = (name, prop) => {
        if(!prop) {
            return;
        }
        scene.loadProp(name, prop);
    };

    const load = (name) => {
        const path = "data/" + name + ".json";
        fetch(path).then(res => res.json()).then((json) => {
            loadMesh(json.mesh);
            loadProp(name, json.prop);
        });
    };

    const start = () => {
        load("core");
        load("start");
        load("hoge");
    };
    return {
        start: start,
        tick: () => {}
    };
};