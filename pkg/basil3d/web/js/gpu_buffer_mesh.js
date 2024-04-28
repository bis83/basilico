
const $__gpuBufferMesh = (app) => {
  const gpu = app.data.gpu;
  const device = gpu.device;

  const instance = [];
  instance.length = gpu.mesh.length;
  for (let i = 0; i < instance.length; ++i) {
    instance[i] = [];
  }

  const buf = new Float32Array(28);
  const stride = (4 * 28);
  let index = 0;
  for (const obj of $stageCurrent(app).room) {
    const room = $room(app, obj.name);
    if (!room) {
      continue;
    }
    if (!room.layout) {
      continue;
    }
    for (const layout of room.layout) {
      for (let i = 0; i < layout.indices.length; ++i) {
        const dx = mod(i, layout.divisor);
        const dz = div(i, layout.divisor);
        const [x0, y0, z0, ha0, va0] = $getOffset(obj.offset, dx * layout.unit, 0, dz * layout.unit, 0, 0);

        const node = layout.node[layout.indices[i]];
        if (!node) {
          continue;
        }
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
  for (const obj of $stageCurrent(app).mob) {
    const mob = $mob(app, obj.name);
    if (!mob) {
      continue;
    }

    const [x0, y0, z0, ha0, va0] = $getOffset(obj.offset, 0, 0, 0, 0, 0);
    for (const mesh of mob.mesh) {
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
  };

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
