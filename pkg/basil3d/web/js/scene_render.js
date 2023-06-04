
const basil3d_scene_write_buffers = (scene, app, gpu, canvas, device) => {
  const mat = new Float32Array(16);
  {
    scene.camera.aspect = canvas.width / canvas.height;
    const at = vec3add(scene.camera.eye, scene.camera.dir);
    const view = mat4lookat(scene.camera.eye, at, scene.camera.up);
    const proj = mat4perspective(scene.camera.fovy, scene.camera.aspect, scene.camera.zNear, scene.camera.zFar);
    const vp = mat4multiply(view, proj);
    mat.set(vp);
    device.queue.writeBuffer(gpu.buffer[0], 0, mat);
  }

  const batch = [];
  batch.length = app.gpu.mesh.length;
  for (let i = 0; i < batch.length; ++i) {
    batch[i] = [];
  }
  let offset = 0;
  for (const e of scene.entity) {
    for (const i of app.gpu.id[e.id].mesh) {
      batch[i].push(offset);
    }
    mat.set(e.matrix);
    device.queue.writeBuffer(gpu.buffer[1], offset, mat);
    offset += 256;
  }
  return batch;
};

const basil3d_scene_render_pass = (batch, app, gpu, pass) => {
  for (let i = 0; i < batch.length; ++i) {
    if (batch[i].length <= 0) {
      continue;
    }

    // set pipeline
    const mesh = app.gpu.mesh[i];
    pass.setPipeline(gpu.pipeline[0]);
    if (mesh.vb0) {
      const [index, offset, size] = mesh.vb0;
      pass.setVertexBuffer(0, app.gpu.buffer[index], offset, size);
    }
    if (mesh.ib) {
      const [index, offset, size] = mesh.ib;
      pass.setIndexBuffer(app.gpu.buffer[index], "uint16", offset, size);
    }

    // render per instance
    for (const offset of batch[i]) {
      pass.setBindGroup(0, gpu.bindGroup[0], [offset]);
      pass.drawIndexed(mesh.count);
    }
  }
};
