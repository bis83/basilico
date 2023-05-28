
const basil3d_gpu_create = (device, canvasFormat) => {
  const obj = {
    bindGroupLayout: [],
    pipelineLayout: [],
    shaderModule: [],
    pipeline: [],
    buffer: [],
    bindGroup: [],
  };

  obj.shaderModule.push(device.createShaderModule({
    code: `
    @binding(0) @group(0) var<uniform> viewProj : mat4x4<f32>;
    @vertex
    fn mainVertex(@location(0) position: vec3<f32>) -> @builtin(position) vec4<f32> {
      return viewProj * vec4(position, 1.0);
    }
    @fragment
    fn mainFragment() -> @location(0) vec4<f32> {
      return vec4(1.0, 1.0, 1.0, 1.0);
    }
    `,
  }));

  obj.bindGroupLayout.push(device.createBindGroupLayout({
    entries: [
      { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: {} },
    ],
  }));
  obj.pipelineLayout.push(device.createPipelineLayout({
    bindGroupLayouts: [
      obj.bindGroupLayout[0],
    ],
  }));
  obj.pipeline.push(device.createRenderPipeline({
    layout: obj.pipelineLayout[0],
    vertex: {
      module: obj.shaderModule[0],
      entryPoint: "mainVertex",
      buffers: [
        { arrayStride: 12, attributes: [{ format: "float32x3", offset: 0, shaderLocation: 0 }] }, // position
        /*
        { arrayStride: 4, attributes: [{ format: "float16x2", offset: 0, shaderLocation: 1 }] }, // normal
        { arrayStride: 4, attributes: [{ format: "float16x2", offset: 0, shaderLocation: 2 }] }, // tangent
        { arrayStride: 4, attributes: [{ format: "float16x2", offset: 0, shaderLocation: 3 }] }, // texcoord0
        { arrayStride: 8, attributes: [{ format: "uint16x4", offset: 0, shaderLocation: 4 }] }, // joints0
        { arrayStride: 8, attributes: [{ format: "float16x4", offset: 0, shaderLocation: 5 }] }, // weights0
        */
      ],
    },
    fragment: {
      module: obj.shaderModule[0],
      entryPoint: "mainFragment",
      targets: [
        { format: canvasFormat }
      ],
    },
    // primitive
    // depthStencil
  }));

  obj.buffer.push(device.createBuffer({
    size: 4 * 4 * 4,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  }));
  obj.bindGroup.push(device.createBindGroup({
    layout: obj.bindGroupLayout[0],
    entries: [
      { binding: 0, resource: { buffer: obj.buffer[0] }, },
    ],
  }));

  return obj;
};
