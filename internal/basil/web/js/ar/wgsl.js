const $__onloadWGSL = async (wgsl, embed) => {
  const device = __gpu.device;

  if (wgsl.shader) {
    for (let i = 0; i < wgsl.shader.length; ++i) {
      const data = wgsl.shader[i];
      const code = await $__decodeTextEmbed(embed[data.embed]);
      const shader = device.createShaderModule({
        code: code,
      });
      wgsl.shader[i] = shader;
    }
  }

  const pipelineLayout = __gpu.pipelineLayout;
  const canvasFormat = __gpu.canvasFormat;

  wgsl.pipeline = [];
  wgsl.pipeline[0] = device.createRenderPipeline({
    layout: pipelineLayout[0],
    vertex: {
      module: wgsl.shader[0],
      entryPoint: "VS",
      buffers: [
        {
          arrayStride: 4,
          attributes: [{ format: "uint32", offset: 0, shaderLocation: 0 }],
          stepMode: "instance",
        }, // instance
        {
          arrayStride: 12,
          attributes: [{ format: "float32x3", offset: 0, shaderLocation: 1 }],
        }, // position
        {
          arrayStride: 12,
          attributes: [{ format: "float32x3", offset: 0, shaderLocation: 2 }],
        }, // normal
        /*
        { arrayStride: 4, attributes: [{ format: "float16x2", offset: 0, shaderLocation: 2 }] }, // tangent
        { arrayStride: 4, attributes: [{ format: "float16x2", offset: 0, shaderLocation: 3 }] }, // texcoord0
        { arrayStride: 8, attributes: [{ format: "uint16x4", offset: 0, shaderLocation: 4 }] }, // joints0
        { arrayStride: 8, attributes: [{ format: "float16x4", offset: 0, shaderLocation: 5 }] }, // weights0
        */
      ],
    },
    fragment: {
      module: wgsl.shader[0],
      entryPoint: "FS",
      targets: [
        { format: "rgb10a2unorm" },
        { format: "rgba8unorm" },
        { format: "rgba8unorm" },
        { format: "rgba16float" },
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
  wgsl.pipeline[1] = device.createRenderPipeline({
    layout: pipelineLayout[1],
    vertex: {
      module: wgsl.shader[1],
      entryPoint: "VS",
      buffers: [],
    },
    fragment: {
      module: wgsl.shader[1],
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
  wgsl.pipeline[2] = device.createRenderPipeline({
    layout: pipelineLayout[1],
    vertex: {
      module: wgsl.shader[1],
      entryPoint: "VS",
      buffers: [],
    },
    fragment: {
      module: wgsl.shader[1],
      entryPoint: "FS_HDR",
      targets: [
        {
          format: "rgba16float",
          blend: {
            color: {
              operation: "add",
              srcFactor: "one",
              dstFactor: "one",
            },
            alpha: {},
          },
        },
      ],
    },
    depthStencil: {
      depthWriteEnabled: false,
      depthCompare: "not-equal",
      format: "depth32float",
    },
  });
  wgsl.pipeline[3] = device.createRenderPipeline({
    layout: pipelineLayout[1],
    vertex: {
      module: wgsl.shader[1],
      entryPoint: "VS",
      buffers: [],
    },
    fragment: {
      module: wgsl.shader[1],
      entryPoint: "FS_HDRSky",
      targets: [
        {
          format: "rgba16float",
          blend: {
            color: {
              operation: "add",
              srcFactor: "one",
              dstFactor: "one",
            },
            alpha: {},
          },
        },
      ],
    },
    depthStencil: {
      depthWriteEnabled: false,
      depthCompare: "equal",
      format: "depth32float",
    },
  });
  wgsl.pipeline[4] = device.createRenderPipeline({
    layout: pipelineLayout[1],
    vertex: {
      module: wgsl.shader[1],
      entryPoint: "VS",
      buffers: [],
    },
    fragment: {
      module: wgsl.shader[1],
      entryPoint: "FS_HDR2LDR",
      targets: [{ format: canvasFormat }],
    },
    depthStencil: {
      depthWriteEnabled: false,
      depthCompare: "always",
      format: "depth32float",
    },
  });
  wgsl.pipeline[5] = device.createRenderPipeline({
    layout: pipelineLayout[0],
    vertex: {
      module: wgsl.shader[2],
      entryPoint: "VS",
      buffers: [
        {
          arrayStride: 8,
          attributes: [{ format: "float32x2", offset: 0, shaderLocation: 0 }],
        }, // position
        {
          arrayStride: 4,
          attributes: [{ format: "unorm8x4", offset: 0, shaderLocation: 1 }],
        }, // color
      ],
    },
    fragment: {
      module: wgsl.shader[2],
      entryPoint: "FS",
      targets: [
        {
          format: canvasFormat,
          blend: {
            color: {
              operation: "add",
              srcFactor: "src-alpha",
              dstFactor: "one-minus-src-alpha",
            },
            alpha: {
              operation: "add",
              srcFactor: "one",
              dstFactor: "zero",
            },
          },
        },
      ],
    },
    depthStencil: {
      depthWriteEnabled: false,
      depthCompare: "always",
      format: "depth32float",
    },
    primitive: {
      cullMode: "back",
      frontFace: "cw",
    },
  });
};
