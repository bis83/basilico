
const $__gpuBufferView = (app) => {
  const gpu = app.data.gpu;
  const device = gpu.device;
  const buf = new Float32Array(84);
  { // Camera
    const camera = $stageCurrent(app).camera;
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
    buf.set(vp, 0);
    buf.set(ivp, 16);
    buf.set(look, 32);
    buf.set(ortho, 48);
    buf.set(eye, 64);
  }
  { // Light
    const light = $stageCurrent(app).light;
    const ha = light.ha;
    const va = light.va;
    const color = light.color;
    const ambient0 = light.ambient0;
    const ambient1 = light.ambient1;
    const ldir = vec3dir(ha, va);
    buf.set(ldir, 68);
    buf.set(color, 72);
    buf.set(ambient0, 76);
    buf.set(ambient1, 80);
  }
  device.queue.writeBuffer(gpu.cbuffer[0], 0, buf);
};
