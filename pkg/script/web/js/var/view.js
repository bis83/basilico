
const $view = {
    view: null,
    slot: null,
    com: [],
    cam: {
        eye: [0, 0, 0],
        vp: new Float32Array(16),
        ivp: new Float32Array(16),
        o: new Float32Array(16),
    },
    m: new Float32Array(16),
};

const view_reset = () => {
    $view.slot = null;
    $view.view = $data.index.initial_view;
};

const view_next = (view) => {
    const i = data_view_index(view);
    if(i < 0) {
        return;
    }
    $view.view = i;
};

const view_tick_before = () => {
    if($view.view === null) {
        view_reset();
    }
};

const view_tick_after = () => {
    const ww = window.innerWidth;
    const wh = window.innerHeight;
    const fovy = deg2rad(30);
    const zNear = 0.1;
    const zFar = 1000;

    const dir = vec3dir($pos.ha, $pos.va);
    const eye = grid_to_world($pos.x, $pos.y, $pos.h);
    eye[2] += $pos_eyeh;

    const at = vec3add(eye, dir);
    const up = [0, 0, 1];
    const view = mat4lookat(eye, at, up);
    const proj = mat4perspective(fovy, ww/wh, zNear, zFar);
    
    const vp = mat4multiply(view, proj);
    $view.cam.vp.set(vp);
    $view.cam.ivp.set(mat4invert(vp));
    $view.cam.o.set(mat4ortho(ww, wh, 0, 1));
    $view.cam.eye = eye;
};

const view_tick = () => {
    view_tick_before();
    const view = data_view($view.view);
    if(!view) {
        return;
    }
    com_tick(view);
    view_tick_after();
};
