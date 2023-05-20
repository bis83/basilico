
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
    @vertex
    fn mainVertex(@location(0) position: vec3<f32>) -> @builtin(position) vec4<f32> {
      return vec4(position, 1.0);
    }
    @fragment
    fn mainFragment() -> @location(0) vec4<f32> {
      return vec4(1.0, 1.0, 1.0, 1.0);
    }
    `,
  }));

  obj.bindGroupLayout.push(device.createBindGroupLayout({ // PerScene
    entries: [
    ],
  }));
  obj.bindGroupLayout.push(device.createBindGroupLayout({ // PerMaterial
    entries: [
    ],
  }));
  obj.bindGroupLayout.push(device.createBindGroupLayout({ // PerInstance
    entries: [
    ],
  }));

  obj.pipelineLayout.push(device.createPipelineLayout({
    bindGroupLayouts: [
      /*
      obj.bindGroupLayout[0],
      obj.bindGroupLayout[1],
      obj.bindGroupLayout[2],
      */
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
    size: 3 * 4 * 3,
    usage: GPUBufferUsage.VERTEX,
    mappedAtCreation: true,
  }));
  new Float32Array(obj.buffer[0].getMappedRange()).set([
    +1, -1, 0,
    -1, -1, 0,
    +0, +1, 0,
  ]);
  obj.buffer[0].unmap();

  return obj;
};
