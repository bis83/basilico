
const $__gpuUploadViewInput = (gpu, view) => {
  const device = gpu.device;
  const buf = new Float32Array(68);
  { // Camera
    const camera = view.camera;
    const aspect = gpu.canvas.width / gpu.canvas.height;
    const fovy = deg2rad(camera.fov);
    const [x, y, z, ha, va] = $getOffset(camera.offset, 0, 0, 0, 0, 0);
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
    const light = view.light;
    const [x, y, z, ha, va] = $getOffset(light.offset, 0, 0, 0, 0, 0);
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

const $__gpuUploadLineInput = (gpu, view) => {
  const device = gpu.device;

  if (!view.lines) {
    return 0;
  }
  if (view.lines.length <= 0) {
    return 0;
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
  device.queue.writeBuffer(gpu.cbuffer[4], 0, position);
  device.queue.writeBuffer(gpu.cbuffer[5], 0, color);
  return view.lines.length;
};

const $__gpuUploadInstanceInput = (gpu, view, app) => {
  const device = gpu.device;

  const instance = [];
  instance.length = gpu.mesh.length;
  for (let i = 0; i < instance.length; ++i) {
    instance[i] = [];
  }

  const buf = new Float32Array(28);
  const stride = (4 * 28);
  let index = 0;
  if (view.room) {
    for (const rid of view.room) {
      const room = $room(app, rid.name);
      if (!room) {
        continue;
      }
      for (let i = 0; i < room.indices.length; ++i) {
        const node = room.node[room.indices[i]];
        if (!node) {
          continue;
        }

        const dx = mod(i, room.divisor);
        const dz = div(i, room.divisor);
        const [x0, y0, z0, ha0, va0] = $getOffset(rid.offset, dx * room.unit, 0, dz * room.unit, 0, 0);

        for (const mid of node.mesh) {
          const mesh = room.mesh[mid];
          if (!mesh) {
            continue;
          }
          const id = $__gpuID(gpu, mesh.name);
          if (id < 0) {
            continue;
          }
          for (const n of gpu.id[id].mesh) {
            instance[n].push(index);
          }

          const [x, y, z, ha, va] = $getOffset(mesh.offset, x0, y0, z0, ha0, va0);
          const matrix = mat4angle(ha, va);
          mat4translated(matrix, x, y, z);
          const factor0 = $getColor(mesh.factor0, 1.0, 1.0, 1.0, 1.0);
          const factor1 = $getColor(mesh.factor1, 1.0, 1.0, 1.0, 0.0);
          const factor2 = $getColor(mesh.factor2, 0.0, 0.0, 0.0, 0.0);
          buf.set(matrix, 0);
          buf.set(factor0, 16);
          buf.set(factor1, 20);
          buf.set(factor2, 24);
          device.queue.writeBuffer(gpu.cbuffer[1], index * stride, buf);
          index += 1;
        }
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
    const mesh = gpu.mesh[i];

    const count = instance[i].length;
    device.queue.writeBuffer(gpu.cbuffer[2], first * 4, new Uint32Array(instance[i]));

    args[0] = mesh.count; // indexCount
    args[1] = count;      // instanceCount
    args[2] = 0;          // firstIndex
    args[3] = 0;          // baseVertex
    args[4] = 0;          // firstInstance, need "indirect-first-instance"
    device.queue.writeBuffer(gpu.cbuffer[3], offset, args);

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
