
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
        if(json.image) {
            json.image = json.image.map(data => decodeImage(data));
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
const data_image = (no) => {
    return data_lookup("image", no);
};
const data_shader = (no) => {
    return data_lookup("shader", no);
};
const data_draw = (no) => {
    return data_lookup("draw", no);
};
const data_item = (no) => {
    return data_lookup("item", no);
};
const data_tile = (no) => {
    return data_lookup("tile", no);
};
const data_component = (no) => {
    return data_lookup("component", no);
};

const data_view_index = (name) => {
    return $data.index.view.findIndex(o => o.n === name);
};
const data_image_index = (name) => {
    return $data.index.image.findIndex(o => o.n === name);
};
const data_item_index = (name) => {
    return $data.index.item.findIndex(o => o.n === name);
};
const data_tile_index = (name) => {
    return $data.index.tile.findIndex(o => o.n === name);
};
const data_component_index = (name) => {
    return $data.index.component.findIndex(o => o.n === name);
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
