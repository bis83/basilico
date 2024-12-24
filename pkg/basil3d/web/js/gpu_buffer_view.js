
const $__gpuBufferView = (app) => {
  const gpu = app.data.gpu;
  const device = gpu.device;
  const buf = new Float32Array(68);
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
    buf.set(vp, 0);
    buf.set(ivp, 16);
    buf.set(look, 32);
    buf.set(eye, 48);
  }
  { // Light
    const light = $stageCurrent(app).light;
    const ha = light.ha;
    const va = light.va;
    const color = $getColor(light.color, 0, 0, 0, 0);
    const ambient0 = $getColor(light.ambient0, 0, 0, 0, 0);
    const ambient1 = $getColor(light.ambient1, 0, 0, 0, 0);
    const ldir = vec3dir(ha, va);
    buf.set(ldir, 52);
    buf.set(color, 56);
    buf.set(ambient0, 60);
    buf.set(ambient1, 64);
  }
  device.queue.writeBuffer(gpu.cbuffer[0], 0, buf);
};
