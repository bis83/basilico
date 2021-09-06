
const makeBundleLoader = (graphics, scene) => {
    const loadMesh = (mesh) => {
        if(!mesh) {
            return;
        }
        for(let data of mesh) {
            graphics.mesh.load(data);
        }
    };
    const loadTexture = (texture) => {
        if(!texture) {
            return;
        }
        for(let data of texture) {
            graphics.texture.load(data);
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
            loadTexture(json.texture);
            loadProp(name, json.prop);
        });
    };
    const unload = (name) => {
    };
    return {
        load: load,
        unload: unload,
    };
};
