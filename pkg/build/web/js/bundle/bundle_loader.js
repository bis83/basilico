
const makeBundleLoader = (graphics) => {
    const loadMesh = (mesh) => {
        if(!mesh) {
            return;
        }
        for(let m of mesh) {
            graphics.mesh.loadMesh(m);
        }
    };

    const load = (name) => {
        const path = "data/" + name + ".json";
        fetch(path).then(res => res.json()).then((json) => {
            loadMesh(json.mesh);
        });
    };

    const start = () => {
        load("start");
        load("hoge");
    };
    return {
        start: start,
        tick: () => {}
    };
};