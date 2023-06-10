
const basil3d_gpu_create = (device, canvasFormat) => {
  const obj = {
    bindGroupLayout: [],
    pipelineLayout: [],
    shaderModule: [],
    pipeline: [],
    buffer: [],
    texture: [],
    bindGroup: [],
  };

  obj.shaderModule[0] = device.createShaderModule({
    code: `
    @binding(0) @group(0) var<uniform> viewProj : mat4x4<f32>;
    @binding(1) @group(0) var<uniform> world : mat4x4<f32>;
    struct VertexInput {
      @location(0) position: vec3<f32>,
      @location(1) normal : vec3<f32>,
    };
    struct VertexOutput {
      @builtin(position) position : vec4<f32>,
      @location(0) normal : vec3<f32>,
    };
    struct FragmentOutput {
      @location(0) normal : vec4<f32>,
    };
    @vertex
    fn mainVertex(input : VertexInput) -> VertexOutput {
      var output : VertexOutput;
      output.position = (viewProj * world * vec4(input.position, 1.0));
      output.normal = normalize((world * vec4(input.normal, 1.0)).xyz);
      return output;
    }
    @fragment
    fn mainFragment(input : VertexOutput) -> FragmentOutput {
      var output : FragmentOutput;
      output.normal = vec4(input.normal * 0.5 + 0.5, 0);
      return output;
    }
    `,
  });
  obj.shaderModule[1] = device.createShaderModule({
    code: `
    @vertex
    fn mainVertex(@builtin(vertex_index) id : u32) -> @builtin(position) vec4<f32> {
      return vec4(2.0f * f32((1 & id) << 1) - 1.0f, -2.0f * f32(2 & id) + 1.0f, 0.0, 1.0);
    }
    `,
  });
  obj.shaderModule[2] = device.createShaderModule({
    code: `
    @group(0) @binding(0) var gbuffer0 : texture_2d<f32>;
    @fragment
    fn mainFragment(@builtin(position) coord : vec4<f32>) -> @location(0) vec4<f32> {
      return textureLoad(gbuffer0, vec2<i32>(floor(coord.xy)), 0);
    }
    `,
  });

  obj.bindGroupLayout[0] = device.createBindGroupLayout({
    entries: [
      { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: {} },
      { binding: 1, visibility: GPUShaderStage.VERTEX, buffer: { hasDynamicOffset: true } },
    ],
  });
  obj.bindGroupLayout[1] = device.createBindGroupLayout({
    entries: [
      { binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'unfilterable-float', } },
    ],
  });

  obj.pipelineLayout[0] = device.createPipelineLayout({
    bindGroupLayouts: [
      obj.bindGroupLayout[0],
    ],
  });
  obj.pipelineLayout[1] = device.createPipelineLayout({
    bindGroupLayouts: [
      obj.bindGroupLayout[1],
    ],
  });

  obj.pipeline[0] = device.createRenderPipeline({
    layout: obj.pipelineLayout[0],
    vertex: {
      module: obj.shaderModule[0],
      entryPoint: "mainVertex",
      buffers: [
        { arrayStride: 12, attributes: [{ format: "float32x3", offset: 0, shaderLocation: 0 }] }, // position
        { arrayStride: 12, attributes: [{ format: "float32x3", offset: 0, shaderLocation: 1 }] }, // normal
        /*
        { arrayStride: 4, attributes: [{ format: "float16x2", offset: 0, shaderLocation: 2 }] }, // tangent
        { arrayStride: 4, attributes: [{ format: "float16x2", offset: 0, shaderLocation: 3 }] }, // texcoord0
        { arrayStride: 8, attributes: [{ format: "uint16x4", offset: 0, shaderLocation: 4 }] }, // joints0
        { arrayStride: 8, attributes: [{ format: "float16x4", offset: 0, shaderLocation: 5 }] }, // weights0
        { arrayStride: 4, attributes: [{ format: "uint32", offset: 0, shaderLocation: 6 }], stepMode: "instance" }, // instance
        */
      ],
    },
    fragment: {
      module: obj.shaderModule[0],
      entryPoint: "mainFragment",
      targets: [
        { format: "rgb10a2unorm" },
      ],
    },
    depthStencil: {
      depthWriteEnabled: true,
      depthCompare: "less",
      format: "depth24plus",
    },
  });
  obj.pipeline[1] = device.createRenderPipeline({
    layout: obj.pipelineLayout[1],
    vertex: {
      module: obj.shaderModule[1],
      entryPoint: "mainVertex",
      buffers: [],
    },
    fragment: {
      module: obj.shaderModule[2],
      entryPoint: "mainFragment",
      targets: [
        { format: canvasFormat },
      ],
    },
  });

  obj.buffer[0] = device.createBuffer({
    size: 64 * 1,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  obj.buffer[1] = device.createBuffer({
    size: 256 * 1024,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  obj.bindGroup[0] = device.createBindGroup({
    layout: obj.bindGroupLayout[0],
    entries: [
      { binding: 0, resource: { buffer: obj.buffer[0] }, },
      { binding: 1, resource: { buffer: obj.buffer[1], size: 256, offset: 0 }, },
    ],
  });

  return obj;
};
