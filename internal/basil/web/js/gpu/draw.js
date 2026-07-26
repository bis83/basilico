const $__gpuDrawBegin = () => {
  $__gpuUpdateGBuffer();

  // reset
  const gpu = __gpu;
  gpu.indexOfPack = 0;
  gpu.indexOfDrawSlot = 0;
  gpu.indexOfDrawArgs = 0;
  gpu.pass3d = [];
};

const $__gpuDrawEnd = () => {
  const device = __gpu.device;
  const ce = device.createCommandEncoder();
  if (__gpu.indexOfPack > 0) {
    $__gpuPassGBuffer(ce);
    $__gpuPassSSAO(ce);
    $__gpuPassHDR(ce);
    $__gpuPassLDR(ce);
  } else {
    $__gpuPassLDRClear(ce);
  }
  device.queue.submit([ce.finish()]);
};

const $draw = (id, slot, args) => {
  const gpu = __gpu;

  gpu.pass3d.push({
    id: id,
    slot: slot,
    args: args,
  });
};
