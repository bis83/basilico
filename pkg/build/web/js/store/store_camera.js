
// init
const store_camera = (store) => {
    store.camera = {
        viewProj: mat4make(),
        ortho: mat4make(),
    };
};

// getter

// action
const store_cameraTickAction = ({ camera }, x, y, z, ha, va) => {
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
    mat4copy(camera.viewProj, view);
    mat4multiply(camera.viewProj, proj);
    mat4ortho(camera.ortho, w, h, 0, 1);
};
