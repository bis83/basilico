
const $__gpuInitPipeline = (gpu) => {
  const device = gpu.device;

  gpu.pipeline[0] = device.createRenderPipeline({
    layout: gpu.pipelineLayout[0],
    vertex: {
      module: gpu.shader[0],
      entryPoint: "VS",
      buffers: [
        { arrayStride: 4, attributes: [{ format: "uint32", offset: 0, shaderLocation: 0 }], stepMode: "instance" }, // instance
        { arrayStride: 12, attributes: [{ format: "float32x3", offset: 0, shaderLocation: 1 }] }, // position
        { arrayStride: 12, attributes: [{ format: "float32x3", offset: 0, shaderLocation: 2 }] }, // normal
        /*
        { arrayStride: 4, attributes: [{ format: "float16x2", offset: 0, shaderLocation: 2 }] }, // tangent
        { arrayStride: 4, attributes: [{ format: "float16x2", offset: 0, shaderLocation: 3 }] }, // texcoord0
        { arrayStride: 8, attributes: [{ format: "uint16x4", offset: 0, shaderLocation: 4 }] }, // joints0
        { arrayStride: 8, attributes: [{ format: "float16x4", offset: 0, shaderLocation: 5 }] }, // weights0
        */
      ],
    },
    fragment: {
      module: gpu.shader[0],
      entryPoint: "FS",
      targets: [
        { format: "rgb10a2unorm" },
        { format: "rgba8unorm" },
        { format: "rgba8unorm" },
      ],
    },
    depthStencil: {
      depthWriteEnabled: true,
      depthCompare: "less",
      format: "depth32float",
    },
    primitive: {
      cullMode: "back",
      frontFace: "cw",
    },
  });
  gpu.pipeline[1] = device.createRenderPipeline({
    layout: gpu.pipelineLayout[1],
    vertex: {
      module: gpu.shader[1],
      entryPoint: "VS",
      buffers: [],
    },
    fragment: {
      module: gpu.shader[1],
      entryPoint: "FS_SSAO",
      targets: [
        {
          format: "rgba8unorm",
          blend: {
            color: {
              operation: "min",
              srcFactor: "one",
              dstFactor: "one",
            },
            alpha: {},
          },
          writeMask: GPUColorWrite.RED,
        },
      ],
    },
  });
  gpu.pipeline[2] = device.createRenderPipeline({
    layout: gpu.pipelineLayout[1],
    vertex: {
      module: gpu.shader[1],
      entryPoint: "VS",
      buffers: [],
    },
    fragment: {
      module: gpu.shader[1],
      entryPoint: "FS_HDR",
      targets: [
        { format: "rgba16float" },
      ],
    },
    depthStencil: {
      depthWriteEnabled: false,
      depthCompare: "not-equal",
      format: "depth32float",
    },
  });
  gpu.pipeline[3] = device.createRenderPipeline({
    layout: gpu.pipelineLayout[1],
    vertex: {
      module: gpu.shader[1],
      entryPoint: "VS",
      buffers: [],
    },
    fragment: {
      module: gpu.shader[1],
      entryPoint: "FS_HDRSky",
      targets: [
        { format: "rgba16float" },
      ],
    },
    depthStencil: {
      depthWriteEnabled: false,
      depthCompare: "equal",
      format: "depth32float",
    },
  });
  gpu.pipeline[4] = device.createRenderPipeline({
    layout: gpu.pipelineLayout[1],
    vertex: {
      module: gpu.shader[1],
      entryPoint: "VS",
      buffers: [],
    },
    fragment: {
      module: gpu.shader[1],
      entryPoint: "FS_HDR2LDR",
      targets: [
        { format: gpu.canvasFormat },
      ],
    },
    depthStencil: {
      depthWriteEnabled: false,
      depthCompare: "always",
      format: "depth32float",
    },
  });
  gpu.pipeline[5] = device.createRenderPipeline({
    layout: gpu.pipelineLayout[0],
    vertex: {
      module: gpu.shader[2],
      entryPoint: "VS",
      buffers: [
        { arrayStride: 12, attributes: [{ format: "float32x3", offset: 0, shaderLocation: 0 }] }, // position
        { arrayStride: 4, attributes: [{ format: "unorm8x4", offset: 0, shaderLocation: 1 }] }, // color
      ],
    },
    fragment: {
      module: gpu.shader[2],
      entryPoint: "FS",
      targets: [
        { format: gpu.canvasFormat },
      ],
    },
    depthStencil: {
      depthWriteEnabled: false,
      depthCompare: "less",
      format: "depth32float",
    },
    primitive: {
      topology: "line-list",
    },
  });
};
