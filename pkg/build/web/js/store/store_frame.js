
const makeStoreFrame = () => {
    // deltaTime
    let prevTime = performance.now();
    let deltaTime = 0;
    const tick = (time) => {
        deltaTime = (time - prevTime) / 1000;
        prevTime = time;
    };

    // pause
    let pause = true;
    const setPause = (flag) => {
        pause = flag;
    };

    // camera
    const dir = vec3make();
    const eye = vec3make();
    const at = vec3make();
    const up = vec3make();
    const fovy = deg2rad(30);
    const zNear = 0.1;
    const zFar = 1000;
    const view = mat4make();
    const proj = mat4make();
    const viewProj = mat4make();
    const ortho = mat4make();
    const calcMatrix = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;

        mat4lookat(view, eye, at, up);
        mat4perspective(proj, fovy, w / h, zNear, zFar);
        mat4copy(viewProj, view);
        mat4multiply(viewProj, proj);
        mat4ortho(ortho, w, h, 0, 1);
    };
    const setCamera = (x, y, z, ha, va) => {
        vec3dir(dir, ha, va);
        vec3set(eye, x, y, z);
        vec3set(at, x, y, z);
        vec3add(at, at, dir);
        vec3set(up, 0, 1, 0);
        calcMatrix();
    };

    const get = {
        deltaTime: () => deltaTime,
        pause: () => pause,
        viewProj: () => viewProj,
        ortho: () => ortho,
    };
    const set = {
        pause: setPause,
        camera: setCamera,
        tick: tick,
    };
    return [get, set];
};
