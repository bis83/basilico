
const makeLoadBundle = (gl) => {
    const update = makeUpdateLoader();
    const draw = makeDrawLoader();
    const mesh = makeGLMeshLoader(gl);
    const shader = makeGLShaderLoader(gl);
    const texture = makeGLTextureLoader(gl);

    const load = (name) => {
        const path = "data/" + name + ".json";
        fetch(path).then(res => res.json()).then((json) => {
            update.load(json.update);
            draw.load(json.draw);
            mesh.load(json.mesh);
            texture.load(json.texture);
            shader.load(json.shader);
        });
    };
    return {
        load: load,
        update: update,
        draw: draw,
        mesh: mesh,
        shader: shader,
        texture: texture,
    };
};
