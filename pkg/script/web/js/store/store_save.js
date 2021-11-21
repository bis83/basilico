
// store
const store_save = (store) => {
    store.save = {
        scene: 0,
        position: [0, 0, 0],
        angle: [0, 0],
        sneak: false,
        vy: 0,
    };
};

// getter
const store_saveHeightGet = ({ save }) => {
    return save.sneak ? 0.9 : 1.75;
};

// action
const store_saveSceneAction = ({ save }, no) => {
    save.scene = no;
};
const store_savePositionAction = ({ save }, x, y, z) => {
    save.position = [x, y, z];
};
const store_saveAngleAction = ({ save }, x, y) => {
    save.angle = [x, y];
};
const store_saveSneakAction = ({ save }, sneak) => {
    save.sneak = sneak;
};
const store_saveVelocityAction = ({ save }, vy) => {
    save.vy = vy;
};

const store_saveStartPositionAction = (store) => {
    const scene = $data.index.start.scene;
    const [x, y, z] = $data.index.start.position;
    const [ax, ay] = $data.index.start.angle;
    store_saveSceneAction(store, scene);
    store_savePositionAction(store, x, y, z);
    store_saveAngleAction(store, ax, ay);
};
