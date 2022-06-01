
const $data = {
    index: null,
    pack: [],
};

const data_loadIndex = () => {
    const path = "data/index.json";
    fetch(path).then(res => res.json()).then((json) => {
        $data.index = json;
    });
};

const data_loadPack = (no) => {
    const path = "data/pack" + no + ".json";
    fetch(path).then(res => res.json()).then((json) => {
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

const data_view = (no) => {
    return $data.pack[0] && $data.pack[0].view[no];
};
const data_view_index = (name) => {
    return $data.pack[0] && $data.pack[0].view.findIndex(obj => obj.name === name);
};

const data_mesh = (no) => {
    return $data.pack[0] && $data.pack[0].mesh[no];
};
const data_texture = (no) => {
    return $data.pack[0] && $data.pack[0].texture[no];
};
const data_shader = (no) => {
    return $data.pack[0] && $data.pack[0].shader[no];
};
const data_draw = (no) => {
    return $data.pack[0] && $data.pack[0].draw[no];
};
const data_tile = (id) => {
    return $data.pack[0] && $data.pack[0].tile.find(obj => obj.id === id);
};
const data_ui = (no) => {
    return $data.pack[0] && $data.pack[0].ui[no];
};
const data_event = (no) => {
    return $data.pack[0] && $data.pack[0].event[no];
};

const data_loaded = () => {
    if ($data.index === null) {
        return false;
    }
    if ($data.pack.length <= 0) {
        return false;
    }
    if ($imageLoading > 0) {
        return false;
    }
    return true;
};
