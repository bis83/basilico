
const basil3d_scene_write_buffers = (scene, app, gpu, canvas, device) => {
  const mat = new Float32Array(16);
  {
    // camera
    scene.camera.aspect = canvas.width / canvas.height;
    const at = vec3add(scene.camera.eye, scene.camera.dir);
    const view = mat4lookat(scene.camera.eye, at, scene.camera.up);
    const proj = mat4perspective(scene.camera.fovy, scene.camera.aspect, scene.camera.zNear, scene.camera.zFar);
    const vp = mat4multiply(view, proj);
    mat.set(vp);
    device.queue.writeBuffer(gpu.buffer[0], 0, mat);
  }
  {
    // objects
    let offset = 0;
    for (const obj of scene.object) {
      mat.set(obj.matrix);
      device.queue.writeBuffer(gpu.buffer[1], offset, mat);
      obj.offset = offset;
      offset += 256;
    }
  }
};

const basil3d_scene_render_pass = (scene, app, gpu, pass) => {
  for (const obj of scene.object) {
    basil3d_app_gpu_draw(app, obj.label, gpu, pass, obj.offset);
  }
};
