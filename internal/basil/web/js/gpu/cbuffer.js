const __strideOfPack = 16;
const __strideOfSlot = 16;
const __strideOfDrawSlot = 4;
const __strideOfDrawArgs = 20;

const $writePack = (pack) => {
  const gpu = __gpu;
  const device = __gpu.device;

  const index = gpu.indexOfPack;
  device.queue.writeBuffer(
    gpu.cbuffer[0],
    gpu.indexOfPack * __strideOfPack,
    pack,
  );
  gpu.indexOfPack += pack.length / 4;
  return index;
};

const $writeSlot = (camera, light) => {
  const gpu = __gpu;
  const device = __gpu.device;

  const slot = [camera, light, 0, 0];
  device.queue.writeBuffer(gpu.cbuffer[1], 0, new Uint32Array(slot));
};

const $writeDrawSlot = (lst) => {
  const gpu = __gpu;
  const device = __gpu.device;

  const index = gpu.indexOfDrawSlot;
  device.queue.writeBuffer(
    gpu.cbuffer[2],
    gpu.indexOfDrawSlot * __strideOfDrawSlot,
    new Uint32Array(lst),
  );
  gpu.indexOfDrawSlot += lst.length;
  return index;
};

const $writeDrawArgs = (id, count) => {
  const gpu = __gpu;
  const device = __gpu.device;

  const gltf = $ar[0].gltf;
  const icount = gltf.input[id] ? gltf.input[id].count : 0;

  const args = new Uint32Array(__strideOfDrawArgs / 4);
  args[0] = icount; // indexCount
  args[1] = count; // instanceCount
  args[2] = 0; // firstIndex
  args[3] = 0; // baseVertex
  args[4] = 0; // firstInstance, need "indirect-first-instance"
  device.queue.writeBuffer(
    gpu.cbuffer[3],
    gpu.indexOfDrawArgs * __strideOfDrawArgs,
    args,
  );

  const index = gpu.indexOfDrawArgs;
  gpu.indexOfDrawArgs += 1;
  return index;
};
