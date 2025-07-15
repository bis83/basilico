
const $__gpuInit = async () => {
  const gpu = $$.gpu;
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
  createCBuffer(0, 512 * 1, GPUBufferUsage.UNIFORM);
  createCBuffer(1, 112 * (2 * 1024), GPUBufferUsage.STORAGE);
  createCBuffer(2, 4 * (16 * 1024), GPUBufferUsage.VERTEX);
  createCBuffer(3, 20 * (2 * 1024), GPUBufferUsage.INDIRECT);
  createCBuffer(4, 12 * (6 * 1024), GPUBufferUsage.VERTEX);
  createCBuffer(5, 4 * (6 * 1024), GPUBufferUsage.VERTEX);

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

const $__gpuUpdateGBuffer = () => {
  const gpu = $$.gpu;
  const device = $$.gpu.device;
  const canvas = $$.gpu.canvas;

  // resize canvas and destroy render targets
  if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const deleteTexture = (no) => {
      if (defined(gpu.gbuffer[no])) {
        gpu.gbuffer[no].destroy();
        delete gpu.gbuffer[no];
      }
    };
    deleteTexture(0);
    deleteTexture(1);
    deleteTexture(2);
    deleteTexture(3);
    deleteTexture(4);

    const deleteBindGroup = (no) => {
      if (defined(gpu.bindGroup[no])) {
        delete gpu.bindGroup[no];
      }
    };
    deleteBindGroup(1);
    deleteBindGroup(2);
    deleteBindGroup(3);
  }

  const createTexture = (i, format) => {
    if (!defined(gpu.gbuffer[i])) {
      gpu.gbuffer[i] = device.createTexture({
        size: [canvas.width, canvas.height],
        format: format,
        usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
      });
    }
  };
  createTexture(0, "depth32float");
  createTexture(1, "rgb10a2unorm");
  createTexture(2, "rgba8unorm");
  createTexture(3, "rgba8unorm");
  createTexture(4, "rgba16float");

  const createBindGroup = (i, t0, t1, t2, t3) => {
    if (!defined(gpu.bindGroup[i])) {
      gpu.bindGroup[i] = device.createBindGroup({
        layout: gpu.bindGroupLayout[1],
        entries: [
          { binding: 0, resource: { buffer: gpu.cbuffer[0] }, },
          { binding: 1, resource: gpu.gbuffer[t0].createView(), },
          { binding: 2, resource: gpu.gbuffer[t1].createView(), },
          { binding: 3, resource: gpu.gbuffer[t2].createView(), },
          { binding: 4, resource: gpu.gbuffer[t3].createView(), },
          { binding: 5, resource: gpu.sampler[0] },
        ],
      });
    }
  };
  createBindGroup(1, 0, 1, 2, 3);
  createBindGroup(2, 0, 1, 1, 1);
  createBindGroup(3, 0, 4, 4, 4);
};

const $__gpuFrameBegin = () => {
  $__gpuUpdateGBuffer();
};

const $__gpuFrameEnd = () => {
  // Upload Buffers

  // Create CommandBuffer
  const device = $$.gpu.device;
  const ce = device.createCommandEncoder();
  $__gpuPassGBuffer(ce);
  $__gpuPassSSAO(ce);
  $__gpuPassHDR(ce);
  $__gpuPassLDR(ce);
  device.queue.submit([ce.finish()]);
};

const $__gpuPassGBuffer = (ce) => {
  const gpu = $$.gpu;

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
      },
      {
        view: gpu.gbuffer[4].createView(),
        clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 0.0 },
        loadOp: "clear",
        storeOp: "store",
      }
    ],
  });
  /*
  for (const b of mesh) {
    pass.setPipeline(wgsl.pipeline[0]);
    pass.setBindGroup(0, gpu.bindGroup[0]);
    pass.setVertexBuffer(0, gpu.cbuffer[2], b.first * 4);

    const segment = gltf.segment[b.id];
    if (segment.vb0) {
      const [index, offset, size] = segment.vb0;
      pass.setVertexBuffer(1, gltf.buffer[index], offset, size);
    }
    if (segment.vb1) {
      const [index, offset, size] = segment.vb1;
      pass.setVertexBuffer(2, gltf.buffer[index], offset, size);
    }
    if (segment.ib) {
      const [index, offset, size] = segment.ib;
      pass.setIndexBuffer(gltf.buffer[index], "uint16", offset, size);
    }

    pass.drawIndexedIndirect(gpu.cbuffer[3], b.offset);
  }
  */
  pass.end();
};

const $__gpuPassSSAO = (ce) => {
  const gpu = $$.gpu;
  const wgsl = $$.data.wgsl;

  const pass = ce.beginRenderPass({
    colorAttachments: [{
      view: gpu.gbuffer[3].createView(),
      loadOp: "load",
      storeOp: "store",
    }],
  });
  pass.setPipeline(wgsl.pipeline[1]);
  pass.setBindGroup(0, gpu.bindGroup[2]);
  pass.draw(4);
  pass.end();
};

const $__gpuPassHDR = (ce) => {
  const gpu = $$.gpu;
  const wgsl = $$.data.wgsl;

  const pass = ce.beginRenderPass({
    depthStencilAttachment: {
      view: gpu.gbuffer[0].createView(),
      depthReadOnly: true,
    },
    colorAttachments: [{
      view: gpu.gbuffer[4].createView(),
      loadOp: "load",
      storeOp: "store",
    }],
  });
  pass.setPipeline(wgsl.pipeline[2]);
  pass.setBindGroup(0, gpu.bindGroup[1]);
  pass.draw(4);
  pass.setPipeline(wgsl.pipeline[3]);
  pass.draw(4);
  pass.end();
};

const $__gpuPassLDR = (ce) => {
  const gpu = $$.gpu;
  const wgsl = $$.data.wgsl;

  const pass = ce.beginRenderPass({
    depthStencilAttachment: {
      view: gpu.gbuffer[0].createView(),
      depthReadOnly: true,
    },
    colorAttachments: [{
      view: gpu.context.getCurrentTexture().createView(),
      clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 0.0 },
      loadOp: "clear",
      storeOp: "store",
    }],
  });
  pass.setPipeline(wgsl.pipeline[4]);
  pass.setBindGroup(0, gpu.bindGroup[3]);
  pass.draw(4);

  /*
  pass.setPipeline(wgsl.pipeline[5]);
  pass.setBindGroup(0, gpu.bindGroup[0]);
  pass.setVertexBuffer(0, gpu.cbuffer[4]);
  pass.setVertexBuffer(1, gpu.cbuffer[5]);
  pass.draw(tile);
  */

  pass.end();
};
