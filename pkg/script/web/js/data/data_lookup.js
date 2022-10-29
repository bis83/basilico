
const data_lookup = (type, no) => {
    if(no <= 0) {
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
const data_base = (no) => {
    return data_lookup("base", no);
};
const data_tile = (no) => {
    return data_lookup("tile", no);
};
const data_mob = (no) => {
    return data_lookup("mob", no);
};
const data_com = (no) => {
    return data_lookup("com", no);
};
const data_view = (no) => {
    return data_lookup("view", no);
};
