
const basil3d_gpu_init = (gpu) => {
  const device = gpu.device;

  gpu.cbuffer[0] = device.createBuffer({
    size: 512 * 1,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  gpu.cbuffer[1] = device.createBuffer({
    size: 96 * (2 * 1024),
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });
  gpu.cbuffer[2] = device.createBuffer({
    size: 4 * (16 * 1024),
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  gpu.cbuffer[3] = device.createBuffer({
    size: 20 * (2 * 1024),
    usage: GPUBufferUsage.INDIRECT | GPUBufferUsage.COPY_DST,
  });
  gpu.cbuffer[4] = device.createBuffer({
    size: 12 * (4 * 1024),
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  gpu.cbuffer[5] = device.createBuffer({
    size: 4 * (4 * 1024),
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });

  gpu.sampler[0] = device.createSampler({
    magFilter: 'linear',
    minFilter: 'linear',
    mipmapFilter: 'linear',
  });

  gpu.bindGroupLayout[0] = device.createBindGroupLayout({
    entries: [
      { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: {} },
      { binding: 1, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: "read-only-storage" } },
    ],
  });
  gpu.bindGroupLayout[1] = device.createBindGroupLayout({
    entries: [
      { binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: {} },
      { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: "depth" } },
      { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: {} },
      { binding: 3, visibility: GPUShaderStage.FRAGMENT, texture: {} },
      { binding: 4, visibility: GPUShaderStage.FRAGMENT, texture: {} },
      { binding: 5, visibility: GPUShaderStage.FRAGMENT, sampler: {} },
    ],
  });

  gpu.pipelineLayout[0] = device.createPipelineLayout({
    bindGroupLayouts: [
      gpu.bindGroupLayout[0],
    ],
  });
  gpu.pipelineLayout[1] = device.createPipelineLayout({
    bindGroupLayouts: [
      gpu.bindGroupLayout[1],
    ],
  });

  gpu.bindGroup[0] = device.createBindGroup({
    layout: gpu.bindGroupLayout[0],
    entries: [
      { binding: 0, resource: { buffer: gpu.cbuffer[0] }, },
      { binding: 1, resource: { buffer: gpu.cbuffer[1] }, },
    ],
  });
};

const basil3d_gpu_id = (gpu, name) => {
  for (let i = 0; i < gpu.id.length; ++i) {
    if (gpu.id[i].name === name) {
      return i;
    }
  }
  return -1;
};
