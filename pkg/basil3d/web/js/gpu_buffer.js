
const basil3d_gpu_upload_view_input = (gpu, device, canvas, view) => {
  const camera = view.camera;

  const buf = new Float32Array(68);

  const aspect = canvas.width / canvas.height;
  const fovy = deg2rad(camera.fov);
  const dir = vec3dir(camera.ha, camera.va);
  const eye = camera.eye;
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

  const light = view.light;
  const ldir = vec3dir(light.ha, light.va);
  buf.set(ldir, 52);
  buf.set(light.color, 56);
  buf.set(light.ambient0, 60);
  buf.set(light.ambient1, 64);
  device.queue.writeBuffer(gpu.buffer[0], 0, buf);
};

const basil3d_gpu_upload_lines = (gpu, device, view) => {
  if (view.lines.length <= 0) {
    return;
  }

  const position = new Float32Array(view.lines.length * 3);
  const color = new Uint8Array(view.lines.length * 4);
  for (let i = 0; i < view.lines.length; ++i) {
    const line = view.lines[i];
    position[i * 3 + 0] = line.pos[0];
    position[i * 3 + 1] = line.pos[1];
    position[i * 3 + 2] = line.pos[2];
    color[i * 4 + 0] = line.color[0];
    color[i * 4 + 1] = line.color[1];
    color[i * 4 + 2] = line.color[2];
    color[i * 4 + 3] = line.color[3];
  }
  device.queue.writeBuffer(gpu.buffer[4], 0, position);
  device.queue.writeBuffer(gpu.buffer[5], 0, color);
};

const basil3d_gpu_upload_instance_input = (gpu, device, app, view) => {
  const instance = [];
  instance.length = app.gpu.mesh.length;
  for (let i = 0; i < instance.length; ++i) {
    instance[i] = [];
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
      const [x0, y0, z0, ha0, va0] = basil3d_view_get_offset(room.offset, dx * room.unit, 0, dz * room.unit, 0, 0);

      for (const mid of node.mesh) {
        const mesh = room.mesh[mid];
        if (!mesh) {
          continue;
        }
        const id = basil3d_app_gpu_id(app, mesh.name);
        if (id < 0) {
          continue;
        }
        for (const n of app.gpu.id[id].mesh) {
          instance[n].push(index);
        }

        const [x, y, z, ha, va] = basil3d_view_get_offset(mesh.offset, x0, y0, z0, ha0, va0);
        const matrix = mat4angle(ha, va);
        mat4translated(matrix, x, y, z);
        const factor0 = basil3d_view_get_color(mesh.factor0, 1.0, 1.0, 1.0, 1.0);
        const factor1 = basil3d_view_get_color(mesh.factor1, 1.0, 1.0, 1.0, 0.0);
        buf.set(matrix, 0);
        buf.set(factor0, 16);
        buf.set(factor1, 20);
        device.queue.writeBuffer(gpu.buffer[1], index * stride, buf);
        index += 1;
      }
    }
  }

  const batch = [];
  let first = 0;
  let offset = 0;
  const args = new Uint32Array(5);
  for (let i = 0; i < instance.length; ++i) {
    if (instance[i].length <= 0) {
      continue;
    }
    const mesh = app.gpu.mesh[i];

    const count = instance[i].length;
    device.queue.writeBuffer(gpu.buffer[2], first * 4, new Uint32Array(instance[i]));

    args[0] = mesh.count; // indexCount
    args[1] = count;      // instanceCount
    args[2] = 0;          // firstIndex
    args[3] = 0;          // baseVertex
    args[4] = 0;          // firstInstance, need "indirect-first-instance"
    device.queue.writeBuffer(gpu.buffer[3], offset, args);

    batch.push({
      id: i,
      first: first,
      offset: offset,
    });

    first += count;
    offset += 20;
  }

  return batch;
};
