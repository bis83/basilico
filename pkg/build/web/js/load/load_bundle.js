
const makeLoadBundle = (gl) => {
    const mesh = makeGLMeshLoader(gl);
    const shader = makeGLShaderLoader(gl);
    const texture = makeGLTextureLoader(gl);
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
            mesh.load(json.mesh);
            texture.load(json.texture);
            shader.load(json.shader);
        });
    };
    const unload = (name) => {
    };
    return {
        load: load,
        unload: unload,
        mesh: mesh,
        shader: shader,
        texture: texture,
        billboard: billboard,
        prop: prop,
    };
};
