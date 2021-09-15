
const makeStoreFrame = () => {
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
    const setCamera = (x, y, z, ha, va) => {
        vec3dir(dir, ha, va);
        vec3set(eye, x, y, z);
        vec3set(at, x, y, z);
        vec3add(at, at, dir);
        vec3set(up, 0, 1, 0);
    };
    const calcMatrix = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;

        mat4lookat(view, eye, at, up);
        mat4perspective(proj, fovy, w / h, zNear, zFar);
        mat4copy(viewProj, view);
        mat4multiply(viewProj, proj);
        mat4ortho(ortho, w, h, 0, 1);
    };

    const obj = {
        setCamera: setCamera,
        calcMatrix: calcMatrix,

        pause: () => pause,
        viewProj: () => viewProj,
        ortho: () => ortho,
    };
    return obj;
};
