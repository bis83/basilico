let __gpu = {
  adapter: null,
  device: null,
  canvasFormat: null,
  canvas: null,
  context: null,
  bindGroupLayout: [],
  pipelineLayout: [],
  sampler: [],
  bindGroup: [],
  cbuffer: [],
  gbuffer: [],
  indexOfPack: 0,
  indexOfDrawSlot: 0,
  indexOfDrawArgs: 0,
  pass3d: [],
};

const $__gpuInit = async () => {
  const gpu = __gpu;
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

  const createCBuffer = (i, size, usage) => {
    gpu.cbuffer[i] = device.createBuffer({
      size: size,
      usage: usage | GPUBufferUsage.COPY_DST,
    });
  };
  createCBuffer(0, __strideOfPack * 65536, GPUBufferUsage.STORAGE); // Pack (StorageBuffer)
  createCBuffer(1, __strideOfSlot * 1, GPUBufferUsage.UNIFORM); // Slot (UniformBuffer)
  createCBuffer(2, __strideOfDrawSlot * (4 * 1024), GPUBufferUsage.VERTEX); // DrawSlot (PerInstance)
  createCBuffer(3, __strideOfDrawArgs * (2 * 1024), GPUBufferUsage.INDIRECT); // DrawArgs (PerDrawCall)

  gpu.sampler[0] = device.createSampler({
    magFilter: "linear",
    minFilter: "linear",
    mipmapFilter: "linear",
  });

  gpu.bindGroupLayout[0] = device.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
        buffer: { type: "read-only-storage" },
      },
      {
        binding: 1,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
        buffer: {},
      },
    ],
  });
  gpu.bindGroupLayout[1] = device.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.FRAGMENT,
        texture: { sampleType: "depth" },
      },
      { binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: {} },
      { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: {} },
      { binding: 3, visibility: GPUShaderStage.FRAGMENT, texture: {} },
      { binding: 4, visibility: GPUShaderStage.FRAGMENT, sampler: {} },
    ],
  });

  gpu.pipelineLayout[0] = device.createPipelineLayout({
    bindGroupLayouts: [gpu.bindGroupLayout[0]],
  });
  gpu.pipelineLayout[1] = device.createPipelineLayout({
    bindGroupLayouts: [gpu.bindGroupLayout[0], gpu.bindGroupLayout[1]],
  });

  gpu.bindGroup[0] = device.createBindGroup({
    layout: gpu.bindGroupLayout[0],
    entries: [
      { binding: 0, resource: { buffer: gpu.cbuffer[0] } },
      { binding: 1, resource: { buffer: gpu.cbuffer[1] } },
    ],
  });
};
