
const makeBundleLoader = (graphics) => {
    const billboard = makeSceneBillboardLoader();
    const prop = makeScenePropLoader();
    
    const load = (name) => {
        const path = "data/" + name + ".json";
        fetch(path).then(res => res.json()).then((json) => {
            // Scene
            if(json.scene) {
                billboard.load(name, json.scene.billboard);
                prop.load(name, json.scene.prop);
            }
            // Resource
            graphics.mesh.load(json.mesh);
            graphics.texture.load(json.texture);
            graphics.shader.load(json.shader);
        });
    };
    const unload = (name) => {
    };
    return {
        load: load,
        unload: unload,
        billboard: billboard,
        prop: prop,
    };
};
