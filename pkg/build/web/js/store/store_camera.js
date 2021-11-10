
// init
const store_camera = (store) => {
    store.camera = {
        viewProj: new Float32Array(16),
        ortho: new Float32Array(16),
    };
};

// getter

// action
const store_cameraTickAction = ({ camera }, x, y, z, ha, va) => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const fovy = deg2rad(30);
    const zNear = 0.1;
    const zFar = 1000;

    const eye = [x, y, z];
    const at = vec3add(eye, vec3dir(ha, va));
    const up = [0, 1, 0];
    const view = mat4lookat(eye, at, up);
    const proj = mat4perspective(fovy, w / h, zNear, zFar);
    
    camera.viewProj.set(mat4multiply(view, proj));
    camera.ortho.set(mat4ortho(w, h, 0, 1));
};
