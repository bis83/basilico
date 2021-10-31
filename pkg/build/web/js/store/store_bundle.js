
// init
const store_bundle = (store) => {
    store.bundle = [];
};

// getter
const store_bundleGet = ({ bundle }, type, name) => {
    for(const b of bundle) {
        if(!b[type]) {
            continue;
        }
        const item = b[type].find(item => item.name === name);
        if(!item) {
            continue;
        }
        return item;
    }
    return null;
};

// action
const store_bundleLoadAction = ({ gl, bundle }, name) => {
    const path = "data/" + name + ".json";
    fetch(path).then(res => res.json()).then((json) => {
        if(json.update) {
            json.update = json.update.map(data => decodeUpdate(data));
        }
        if(json.draw) {
            json.draw = json.draw.map(data => decodeDraw(gl, data));
        }
        if(json.mesh) {
            json.mesh = json.mesh.map(data => decodeMesh(gl, data));
        }
        if(json.texture) {
            json.texture = json.texture.map(data => decodeTexture(gl, data));
        }
        if(json.shader) {
            json.shader = json.shader.map(data => decodeShader(gl, data));
        }
        bundle.push(json);
    });
};
