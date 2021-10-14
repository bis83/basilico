
// store
const store_frame = (store) => {
    store.frame = {
        prevTime: performance.now(),
        deltaTime: 0,
        pause: true,
        viewProj: mat4make(),
        ortho: mat4make(),
    };
    return store;
};

// getter

// action
const store_frameTickAction = ({ frame }) => {  
    const time = performance.now();
    frame.deltaTime = (time - frame.prevTime) / 1000;
    frame.prevTime = time;
};
const store_framePauseAction = ({ frame }, flag) => {
    frame.pause = flag;
};
const store_frameCameraAction = ({ frame }, x, y, z, ha, va) => {
    const dir = vec3make();
    const eye = vec3make();
    const at = vec3make();
    const up = vec3make();
    const fovy = deg2rad(30);
    const zNear = 0.1;
    const zFar = 1000;
    const view = mat4make();
    const proj = mat4make();

    vec3dir(dir, ha, va);
    vec3set(eye, x, y, z);
    vec3set(at, x, y, z);
    vec3add(at, at, dir);
    vec3set(up, 0, 1, 0);
    const w = window.innerWidth;
    const h = window.innerHeight;
    mat4lookat(view, eye, at, up);
    mat4perspective(proj, fovy, w / h, zNear, zFar);
    mat4copy(frame.viewProj, view);
    mat4multiply(frame.viewProj, proj);
    mat4ortho(frame.ortho, w, h, 0, 1);
};
