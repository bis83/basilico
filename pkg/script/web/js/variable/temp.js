
const $temp = {
    view: null,
    slot: null,
    cam: {
        eye: [0, 0, 0],
        vp: new Float32Array(16),
        ivp: new Float32Array(16),
        o: new Float32Array(16),
    },
};

const reset_view = () => {
    $temp.slot = null;
    $temp.view = $data.index.initial_view;
};

const next_view = (view) => {
    const i = data_view_index(view);
    if(i < 0) {
        return;
    }
    $temp.view = i;
};

const view_tick = () => {
    if($temp.view === null) {
        reset_view();
    }
};

const camera_tick = () => {
    const ww = window.innerWidth;
    const wh = window.innerHeight;
    const fovy = deg2rad(30);
    const zNear = 0.1;
    const zFar = 1000;

    const dir = vec3dir($pos.ha, $pos.va);
    const eye = vec3world($pos.x, $pos.y, $pos.h);
    eye[2] += $pos.eyeh;

    const at = vec3add(eye, dir);
    const up = [0, 0, 1];
    const view = mat4lookat(eye, at, up);
    const proj = mat4perspective(fovy, ww/wh, zNear, zFar);
    
    const vp = mat4multiply(view, proj);
    $temp.cam.vp.set(vp);
    $temp.cam.ivp.set(mat4invert(vp));
    $temp.cam.o.set(mat4ortho(ww, wh, 0, 1));
    $temp.cam.eye = eye;
};
