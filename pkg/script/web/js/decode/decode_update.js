
const decodeUpdateGround = (data) => {
    if(data.b) {
        data.b = base64ToFloat32Array(data.b)
    }
    if(data.dop6) {
        data.dop6 = base64ToInt32Array(data.dop6)
    }
    if(data.dop8) {
        data.dop8 = base64ToInt32Array(data.dop8)
    }
    if(data.dop12) {
        data.dop12 = base64ToInt32Array(data.dop12)
    }
    return data;
};

const decodeUpdate = (data) => {
    if(data.ground) {
        data.ground = data.ground.map(data => decodeUpdateGround(data));
    }
    return data;
};
