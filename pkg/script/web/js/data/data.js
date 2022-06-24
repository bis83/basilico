
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

const data_lookup = (type, no) => {
    if(no < 0) {
        return null;
    }
    const table = $data.index[type];
    if(!table) {
        return null;
    }
    const entry = table[no];
    if(!entry) {
        return null;
    }
    const pack = $data.pack[entry.p];
    if(!pack) {
        return null;
    }
    return pack[type][entry.i];
};

const data_view = (no) => {
    return data_lookup("view", no);
};
const data_mesh = (no) => {
    return data_lookup("mesh", no);
};
const data_texture = (no) => {
    return data_lookup("texture", no);
};
const data_shader = (no) => {
    return data_lookup("shader", no);
};
const data_draw = (no) => {
    return data_lookup("draw", no);
};
const data_tile = (no) => {
    return data_lookup("tile", no);
};
const data_ui = (no) => {
    return data_lookup("ui", no);
};
const data_event = (no) => {
    return data_lookup("event", no);
};

const data_view_index = (name) => {
    return $data.index.view.findIndex(o => o.n === name);
};
const data_texture_index = (name) => {
    return $data.index.texture.findIndex(o => o.n === name);
};
const data_item_index = (name) => {
    return $data.index.item.findIndex(o => o.n === name);
};
const data_tile_index = (name) => {
    return $data.index.tile.findIndex(o => o.n === name);
};
const data_ui_index = (name) => {
    return $data.index.ui.findIndex(o => o.n === name);
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
