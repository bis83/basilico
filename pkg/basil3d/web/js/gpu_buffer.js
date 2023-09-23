
const basil3d_gpu_upload_view_input = (gpu, device, canvas, view) => {
  const buf = new Float32Array(52);
  const camera = view.camera;
  camera.aspect = canvas.width / canvas.height;
  const dir = vec3dir(camera.ha, camera.va);
  const at = vec3add(camera.eye, dir);
  const look = mat4lookat(camera.eye, at, camera.up);
  const proj = mat4perspective(camera.fovy, camera.aspect, camera.zNear, camera.zFar);
  const vp = mat4multiply(look, proj);
  const ivp = mat4invert(vp);
  buf.set(vp, 0);
  buf.set(ivp, 16);
  buf.set(camera.eye, 32);

  const light = view.light;
  const ldir = vec3dir(light.ha, light.va);
  buf.set(ldir, 36);
  buf.set(light.color, 40);
  buf.set(light.ambient0, 44);
  buf.set(light.ambient1, 48);
  device.queue.writeBuffer(gpu.buffer[0], 0, buf);
};

const basil3d_gpu_upload_instance_input = (gpu, device, app, view) => {
  const batch = [];
  batch.length = app.gpu.mesh.length;
  for (let i = 0; i < batch.length; ++i) {
    batch[i] = [];
  }

  const buf = new Float32Array(24);
  const stride = (4 * 24);
  let index = 0;
  for (const room of view.room) {
    for (let i = 0; i < room.indices.length; ++i) {
      const node = room.node[room.indices[i]];
      if (!node) {
        continue;
      }

      const dx = mod(i, room.divisor);
      const dz = div(i, room.divisor);
      for (const mesh of node.mesh) {
        const id = basil3d_app_gpu_id(app, mesh.name);
        if (id < 0) {
          continue;
        }
        for (const n of app.gpu.id[id].mesh) {
          batch[n].push(index);
        }

        let x = dx * room.unit;
        let y = 0;
        let z = dz * room.unit;
        let ha = 0;
        let va = 0;
        if (mesh.transform) {
          x += mesh.transform.x || 0;
          y += mesh.transform.y || 0;
          z += mesh.transform.z || 0;
          ha = mesh.transform.ha || 0;
          va = mesh.transform.va || 0;
        }
        const matrix = mat4angle(ha, va);
        mat4translated(matrix, x, y, z);

        const factor0 = [1.0, 1.0, 1.0, 1.0];
        if (mesh.albedo) {
          factor0[0] = mesh.albedo.r !== undefined ? mesh.albedo.r : 1.0;
          factor0[1] = mesh.albedo.g !== undefined ? mesh.albedo.g : 1.0;
          factor0[2] = mesh.albedo.b !== undefined ? mesh.albedo.b : 1.0;
          factor0[3] = mesh.albedo.a !== undefined ? mesh.albedo.a : 1.0;
        }
        const factor1 = [1.0, 0.5, 0.5, 0.0];
        if (mesh.occlusion !== undefined) {
          factor1[0] = mesh.occlusion;
        }
        if (mesh.metallic !== undefined) {
          factor1[1] = mesh.metallic;
        }
        if (mesh.roughness !== undefined) {
          factor1[2] = mesh.roughness;
        }
        if (mesh.emission !== undefined) {
          factor1[3] = mesh.emission;
        }

        buf.set(matrix, 0);
        buf.set(factor0, 16);
        buf.set(factor1, 20);
        device.queue.writeBuffer(gpu.buffer[1], index * stride, buf);
        index += 1;
      }
    }
  }

  const range = [];
  range.length = batch.length;
  let start = 0;
  for (let i = 0; i < batch.length; ++i) {
    if (batch[i].length <= 0) {
      continue;
    }

    const count = batch[i].length;
    device.queue.writeBuffer(gpu.buffer[2], start * 4, new Uint32Array(batch[i]));
    range[i] = [start, count];
    start += count;
  }
  return range;
};
