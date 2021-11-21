
const $pack = [];

const $pack_load = (no) => {
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
        $pack[no] = json;
    });
};

const $pack_update = (no) => {
    return $pack[0].update[no];
};
const $pack_draw = (no) => {
    return $pack[0].draw[no];
};
const $pack_mesh = (no) => {
    return $pack[0].mesh[no];
};
const $pack_texture = (no) => {
    return $pack[0].texture[no];
};
const $pack_shader = (no) => {
    return $pack[0].shader[no];
};
