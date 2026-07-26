const $newCamera = () => {
  return {
    x: 0,
    y: 0,
    z: 0,
    ha: 0,
    va: 0,
    fov: 0,
    near: 0,
    far: 0,
  };
};

const $cameraPosition = (camera, x, y, z) => {
  camera.x = x;
  camera.y = y;
  camera.z = z;
};

const $cameraAngle = (camera, ha, va) => {
  camera.ha = ha;
  camera.va = va;
};

const $cameraFov = (camera, fov) => {
  camera.fov = fov;
};

const $cameraZClip = (camera, near, far) => {
  camera.near = near;
  camera.far = far;
};

const $packCamera = (camera) => {
  const gpu = __gpu;

  const aspect = gpu.canvas.width / gpu.canvas.height;
  const fovy = deg2rad(camera.fov);
  const x = camera.x;
  const y = camera.y;
  const z = camera.z;
  const ha = camera.ha;
  const va = camera.va;
  const dir = vec3dir(ha, va);
  const eye = [x, y, z];
  const at = vec3add(eye, dir);
  const up = [0, 1, 0];
  const look = mat4lookat(eye, at, up);
  const proj = mat4perspective(fovy, aspect, camera.near, camera.far);
  const vp = mat4multiply(look, proj);
  const ivp = mat4invert(vp);
  const ortho = mat4ortho(gpu.canvas.width, gpu.canvas.height, 0.0, 1.0);

  const pack = new Float32Array(4 * 17);
  pack.set(vp, 0);
  pack.set(ivp, 16);
  pack.set(look, 32);
  pack.set(ortho, 48);
  pack.set(eye, 64);
  return pack;
};
