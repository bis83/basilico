
const data_lookup_index = (type, name) => {
    const table = $data.index[type];
    if(!table) {
        return 0;
    }
    const i = table.findIndex(o => o && o.n === name);
    if(i <= 0) {
        return 0;
    }
    return i;
};

const data_mesh_index = (name) => {
    return data_lookup_index("mesh", name);
};
const data_image_index = (name) => {
    return data_lookup_index("image", name);
};
const data_shader_index = (name) => {
    return data_lookup_index("shader", name);
};
const data_draw_index = (name) => {
    return data_lookup_index("draw", name);
};
const data_item_index = (name) => {
    return data_lookup_index("item", name);
};
const data_base_index = (name) => {
    return data_lookup_index("base", name);
};
const data_tile_index = (name) => {
    return data_lookup_index("tile", name);
};
const data_mob_index = (name) => {
    return data_lookup_index("mob", name);
};
const data_com_index = (name) => {
    return data_lookup_index("com", name);
};
const data_view_index = (name) => {
    return data_lookup_index("view", name);
};
