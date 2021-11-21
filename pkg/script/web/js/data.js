
const $data = {
    index: null,
    pack: [],
};

const $data_loaded = () => {
    return ($data.index != null) && ($data.pack.length > 0);
};

const $data_loadIndex = () => {
    const path = "data/index.json";
    fetch(path).then(res => res.json()).then((json) => {
        $data.index = json;
    });
};

const $data_loadPack = (no) => {
    const path = "data/pack" + no + ".json";
    fetch(path).then(res => res.json()).then((json) => {
        if(json.update) {
            json.update = json.update.map(data => decodeUpdate(data));
        }
        if(json.draw) {
            json.draw = json.draw.map(data => decodeDraw(data));
        }
        if(json.mesh) {
            json.mesh = json.mesh.map(data => decodeMesh(data));
        }
        if(json.texture) {
            json.texture = json.texture.map(data => decodeTexture(data));
        }
        if(json.shader) {
            json.shader = json.shader.map(data => decodeShader(data));
        }
        $data.pack[no] = json;
    });
};

const $data_update = (no) => {
    return $data.pack[0].update[no];
};
const $data_draw = (no) => {
    return $data.pack[0].draw[no];
};
const $data_mesh = (no) => {
    return $data.pack[0].mesh[no];
};
const $data_texture = (no) => {
    return $data.pack[0].texture[no];
};
const $data_shader = (no) => {
    return $data.pack[0].shader[no];
};
