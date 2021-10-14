
// store
const store_save = (store) => {
    store.save = {
        scene: "",
        position: [0, 0, 0],
        angle: [0, 0],
    };
    return store;
};

// getter

// action
const store_saveSceneAction = ({ save }, name) => {
    save.scene = name;
};
const store_savePositionAction = ({ save }, x, y, z) => {
    save.position = [x, y, z];
};
const store_saveAngleAction = ({ save }, x, y) => {
    save.angle = [x, y];
};
