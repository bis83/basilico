
const basil3d_gpu_create = (device, canvasFormat) => {
  const gpu = {
    bindGroupLayout: [],
    pipelineLayout: [],
    shaderModule: [],
    pipeline: [],
    buffer: [],
    sampler: [],
    bindGroup: [],
    gbuffer: [],
  };

  gpu.buffer[0] = device.createBuffer({
    size: 512 * 1,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  gpu.buffer[1] = device.createBuffer({
    size: 96 * (2 * 1024),
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  });
  gpu.buffer[2] = device.createBuffer({
    size: 4 * (16 * 1024),
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  gpu.buffer[3] = device.createBuffer({
    size: 20 * (2 * 1024),
    usage: GPUBufferUsage.INDIRECT | GPUBufferUsage.COPY_DST,
  });
  gpu.buffer[4] = device.createBuffer({
    size: 12 * (4 * 1024),
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  gpu.buffer[5] = device.createBuffer({
    size: 4 * (4 * 1024),
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });

  gpu.sampler[0] = device.createSampler({
    magFilter: 'linear',
    minFilter: 'linear',
    mipmapFilter: 'linear',
  });

  gpu.shaderModule[0] = device.createShaderModule({
    code: shaderModule0,
  });
  gpu.shaderModule[1] = device.createShaderModule({
    code: shaderModule1,
  });
  gpu.shaderModule[2] = device.createShaderModule({
    code: shaderModule2,
  });
  gpu.shaderModule[3] = device.createShaderModule({
    code: shaderModule3,
  });
  gpu.shaderModule[4] = device.createShaderModule({
    code: shaderModule4,
  });
  gpu.shaderModule[5] = device.createShaderModule({
    code: shaderModule5,
  });
  gpu.shaderModule[6] = device.createShaderModule({
    code: shaderModule6,
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

  gpu.bindGroup[0] = device.createBindGroup({
    layout: gpu.bindGroupLayout[0],
    entries: [
      { binding: 0, resource: { buffer: gpu.buffer[0] }, },
      { binding: 1, resource: { buffer: gpu.buffer[1] }, },
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

  gpu.pipeline[0] = device.createRenderPipeline({
    layout: gpu.pipelineLayout[0],
    vertex: {
      module: gpu.shaderModule[0],
      entryPoint: "mainVertex",
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
      module: gpu.shaderModule[0],
      entryPoint: "mainFragment",
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
      module: gpu.shaderModule[1],
      entryPoint: "mainVertex",
      buffers: [],
    },
    fragment: {
      module: gpu.shaderModule[2],
      entryPoint: "mainFragment",
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
      module: gpu.shaderModule[1],
      entryPoint: "mainVertex",
      buffers: [],
    },
    fragment: {
      module: gpu.shaderModule[3],
      entryPoint: "mainFragment",
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
      module: gpu.shaderModule[1],
      entryPoint: "mainVertex",
      buffers: [],
    },
    fragment: {
      module: gpu.shaderModule[4],
      entryPoint: "mainFragment",
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
      module: gpu.shaderModule[1],
      entryPoint: "mainVertex",
      buffers: [],
    },
    fragment: {
      module: gpu.shaderModule[5],
      entryPoint: "mainFragment",
      targets: [
        { format: canvasFormat },
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
      module: gpu.shaderModule[6],
      entryPoint: "mainVertex",
      buffers: [
        { arrayStride: 12, attributes: [{ format: "float32x3", offset: 0, shaderLocation: 0 }] }, // position
        { arrayStride: 4, attributes: [{ format: "unorm8x4", offset: 0, shaderLocation: 1 }] }, // color
      ],
    },
    fragment: {
      module: gpu.shaderModule[6],
      entryPoint: "mainFragment",
      targets: [
        { format: canvasFormat },
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

  return gpu;
};

const basil3d_gpu_on_frame_start = (gpu, device, canvas) => {
  basil3d_gpu_gbuffer(gpu, device, canvas);
};

const basil3d_gpu_on_frame_loading = (gpu, device, context) => {
  const ce = device.createCommandEncoder();
  const pass = ce.beginRenderPass({
    colorAttachments: [{
      view: context.getCurrentTexture().createView(),
      clearValue: { r: 0.2, g: 0.2, b: 0.2, a: 1.0 },
      loadOp: "clear",
      storeOp: "store",
    }],
  });
  pass.end();
  device.queue.submit([ce.finish()]);
};

const basil3d_gpu_on_frame_view = (gpu, device, context, canvas, app, view) => {
  // Upload Buffers
  basil3d_gpu_upload_view_input(gpu, device, canvas, view);
  basil3d_gpu_upload_lines(gpu, device, view);
  const batch = basil3d_gpu_upload_instance_input(gpu, device, app, view);

  // Create CommandBuffer
  const ce = device.createCommandEncoder();
  { // Write G-Buffer
    const pass = ce.beginRenderPass({
      depthStencilAttachment: {
        view: gpu.gbuffer[0].createView(),
        depthClearValue: 1.0,
        depthLoadOp: "clear",
        depthStoreOp: "store",
      },
      colorAttachments: [
        {
          view: gpu.gbuffer[1].createView(),
          clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 0.0 },
          loadOp: "clear",
          storeOp: "store",
        },
        {
          view: gpu.gbuffer[2].createView(),
          clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 0.0 },
          loadOp: "clear",
          storeOp: "store",
        },
        {
          view: gpu.gbuffer[3].createView(),
          clearValue: { r: 1.0, g: 0.0, b: 0.0, a: 0.0 },
          loadOp: "clear",
          storeOp: "store",
        }
      ],
    });
    for (const b of batch) {
      pass.setPipeline(gpu.pipeline[0]);
      pass.setBindGroup(0, gpu.bindGroup[0]);
      pass.setVertexBuffer(0, gpu.buffer[2], b.first * 4);

      const mesh = app.gpu.mesh[b.id];
      if (mesh.vb0) {
        const [index, offset, size] = mesh.vb0;
        pass.setVertexBuffer(1, app.gpu.buffer[index], offset, size);
      }
      if (mesh.vb1) {
        const [index, offset, size] = mesh.vb1;
        pass.setVertexBuffer(2, app.gpu.buffer[index], offset, size);
      }
      if (mesh.ib) {
        const [index, offset, size] = mesh.ib;
        pass.setIndexBuffer(app.gpu.buffer[index], "uint16", offset, size);
      }

      pass.drawIndexedIndirect(gpu.buffer[3], b.offset);
    }
    pass.end();
  }
  { // Screen-Space AO
    const pass = ce.beginRenderPass({
      colorAttachments: [{
        view: gpu.gbuffer[3].createView(),
        loadOp: "load",
        storeOp: "store",
      }],
    });
    pass.setPipeline(gpu.pipeline[1]);
    pass.setBindGroup(0, gpu.bindGroup[2]);
    pass.draw(4);
    pass.end();
  }
  { // HDR Color-Space
    const pass = ce.beginRenderPass({
      depthStencilAttachment: {
        view: gpu.gbuffer[0].createView(),
        depthReadOnly: true,
      },
      colorAttachments: [{
        view: gpu.gbuffer[4].createView(),
        clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 0.0 },
        loadOp: "clear",
        storeOp: "store",
      }],
    });
    pass.setPipeline(gpu.pipeline[2]);
    pass.setBindGroup(0, gpu.bindGroup[1]);
    pass.draw(4);
    pass.setPipeline(gpu.pipeline[3]);
    pass.draw(4);
    pass.end();
  }
  { // LDR Color-Space
    const pass = ce.beginRenderPass({
      depthStencilAttachment: {
        view: gpu.gbuffer[0].createView(),
        depthReadOnly: true,
      },
      colorAttachments: [{
        view: context.getCurrentTexture().createView(),
        clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 0.0 },
        loadOp: "clear",
        storeOp: "store",
      }],
    });
    pass.setPipeline(gpu.pipeline[4]);
    pass.setBindGroup(0, gpu.bindGroup[3]);
    pass.draw(4);
    if (view.lines.length > 0) {
      pass.setPipeline(gpu.pipeline[5]);
      pass.setBindGroup(0, gpu.bindGroup[0]);
      pass.setVertexBuffer(0, gpu.buffer[4]);
      pass.setVertexBuffer(1, gpu.buffer[5]);
      pass.draw(view.lines.length);
    }
    pass.end();
  }
  device.queue.submit([ce.finish()]);
};
