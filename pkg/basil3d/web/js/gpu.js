
const $__gpuInit = async (gpu, embed) => {
  gpu.adapter = await navigator.gpu.requestAdapter();
  gpu.device = await gpu.adapter.requestDevice();
  gpu.canvasFormat = navigator.gpu.getPreferredCanvasFormat();
  gpu.canvas = html_canvas();
  gpu.context = gpu.canvas.getContext("webgpu");
  gpu.context.configure({
    device: gpu.device,
    format: gpu.canvasFormat,
    alphaMode: "opaque",
  });
  const device = gpu.device;

  if (gpu.buffer) {
    for (let i = 0; i < gpu.buffer.length; ++i) {
      const data = gpu.buffer[i];
      const binary = await $__decodeBufferEmbed(embed[data.embed]);
      const buffer = device.createBuffer({
        size: binary.length,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.INDEX,
        mappedAtCreation: true,
      });
      const view = new DataView(buffer.getMappedRange());
      for (let i = 0; i < binary.length; ++i) {
        view.setUint8(i, binary[i]);
      }
      buffer.unmap();
      gpu.buffer[i] = buffer;
    }
  }
  if (gpu.shader) {
    for (let i = 0; i < gpu.shader.length; ++i) {
      const data = gpu.shader[i];
      const code = await $__decodeShaderEmbed(embed[data.embed]);
      const shader = device.createShaderModule({
        code: code,
      });
      gpu.shader[i] = shader;
    }
  }

  gpu.bindGroupLayout = [];
  gpu.pipelineLayout = [];
  gpu.pipeline = [];
  gpu.sampler = [];
  gpu.bindGroup = [];
  gpu.cbuffer = [];
  gpu.gbuffer = [];

  const createCBuffer = (i, size, usage) => {
    gpu.cbuffer[i] = device.createBuffer({
      size: size,
      usage: usage | GPUBufferUsage.COPY_DST,
    });
  };
  createCBuffer(0, 512 * 1, GPUBufferUsage.UNIFORM);
  createCBuffer(1, 96 * (2 * 1024), GPUBufferUsage.STORAGE);
  createCBuffer(2, 4 * (16 * 1024), GPUBufferUsage.VERTEX);
  createCBuffer(3, 20 * (2 * 1024), GPUBufferUsage.INDIRECT);
  createCBuffer(4, 12 * (4 * 1024), GPUBufferUsage.VERTEX);
  createCBuffer(5, 4 * (4 * 1024), GPUBufferUsage.VERTEX);

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

  $__gpuInitPipeline(gpu);
};

const $__gpuID = (gpu, name) => {
  for (let i = 0; i < gpu.id.length; ++i) {
    if (gpu.id[i].name === name) {
      return i;
    }
  }
  return -1;
};
