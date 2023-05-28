
const basil3d_scene_create = () => {
  return {};
};

const basil3d_scene_write_buffers = (scene, app, gpu, canvas, device) => {
  const aspect = canvas.width / canvas.height;
  const fovy = deg2rad(30);
  const zNear = 0.1;
  const zFar = 1000;
  let dir = [0, 0, 1];
  let eye = [0, 1.5, -5];
  const at = vec3add(eye, dir);
  const up = [0, 1, 0];
  const view = mat4lookat(eye, at, up);
  const proj = mat4perspective(fovy, aspect, zNear, zFar);
  const vp = mat4multiply(view, proj);
  const mat = new Float32Array(vp);
  device.queue.writeBuffer(gpu.buffer[0], 0, mat);
};

const basil3d_scene_render_pass = (scene, app, gpu, pass) => {
  if (basil3d_app_is_loading(app)) {
    return;
  }
  basil3d_app_gpu_draw(app, "tr_01", gpu, pass);
};
