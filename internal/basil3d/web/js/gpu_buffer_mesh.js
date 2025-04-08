
const $__gpuBufferMesh = (app) => {
  const gpu = app.data.gpu;
  const device = gpu.device;

  const instance = [];
  instance.length = gpu.segment.length;
  for (let i = 0; i < instance.length; ++i) {
    instance[i] = [];
  }

  const buf = new Float32Array(28);
  const stride = (4 * 28);
  let index = 0;
  for (const obj of $stageCurrent(app).room) {
    const room = $dataRoom(app, obj.data);
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
        const x0 = obj.x + (dx * layout.unit);
        const y0 = obj.y;
        const z0 = obj.z + (dz * layout.unit);
        const ha0 = obj.ha;
        const va0 = obj.va;

        const node = layout.node[layout.indices[i]];
        if (!node) {
          continue;
        }
        for (const mid of node.mesh) {
          const mesh = room.mesh[mid];
          if (!mesh) {
            continue;
          }
          const m = gpu.mesh[mesh.data];
          if (!m) {
            continue;
          }
          for (const n of m.segment) {
            instance[n].push(index);
          }

          const x = x0 + mesh.x;
          const y = y0 + mesh.y;
          const z = z0 + mesh.z;
          const ha = ha0 + mesh.ha;
          const va = va0 + mesh.va;
          const matrix = mat4angle(ha, va);
          mat4translated(matrix, x, y, z);
          const factor0 = mesh.factor0;
          const factor1 = mesh.factor1;
          const factor2 = mesh.factor2;
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
    const mob = $dataMob(app, obj.data);
    if (!mob) {
      continue;
    }

    const x0 = obj.x;
    const y0 = obj.y;
    const z0 = obj.z;
    const ha0 = obj.ha;
    const va0 = obj.va;
    for (const mesh of mob.mesh) {
      const m = gpu.mesh[mesh.data];
      if (!m) {
        continue;
      }
      for (const n of m.segment) {
        instance[n].push(index);
      }

      const x = x0 + mesh.x;
      const y = y0 + mesh.y;
      const z = z0 + mesh.z;
      const ha = ha0 + mesh.ha;
      const va = va0 + mesh.va;
      const matrix = mat4angle(ha, va);
      mat4translated(matrix, x, y, z);
      const factor0 = mesh.factor0;
      const factor1 = mesh.factor1;
      const factor2 = mesh.factor2;
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
    const segment = gpu.segment[i];

    const count = instance[i].length;
    device.queue.writeBuffer(gpu.cbuffer[2], first * 4, new Uint32Array(instance[i]));

    args[0] = segment.count;// indexCount
    args[1] = count;        // instanceCount
    args[2] = 0;            // firstIndex
    args[3] = 0;            // baseVertex
    args[4] = 0;            // firstInstance, need "indirect-first-instance"
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
