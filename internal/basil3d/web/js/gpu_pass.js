
const $__gpuFrameBegin = (app) => {
  const gpu = app.data.gpu;
  $__gpuGBufferResize(gpu);
};

const $__gpuFrameEnd = (app) => {
  // Upload Buffers
  $__gpuBufferView(app);
  const mesh = $__gpuBufferMesh(app);
  const tile = $__gpuBufferTile(app);

  // Create CommandBuffer
  const gpu = app.data.gpu;
  const device = gpu.device;
  const ce = device.createCommandEncoder();
  $__gpuPassGBuffer(ce, gpu, mesh);
  $__gpuPassSSAO(ce, gpu);
  $__gpuPassHDR(ce, gpu);
  $__gpuPassLDR(ce, gpu, tile);
  device.queue.submit([ce.finish()]);
};

const $__gpuPassGBuffer = (ce, gpu, mesh) => {
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
  for (const b of mesh) {
    pass.setPipeline(gpu.pipeline[0]);
    pass.setBindGroup(0, gpu.bindGroup[0]);
    pass.setVertexBuffer(0, gpu.cbuffer[2], b.first * 4);

    const segment = gpu.segment[b.id];
    if (segment.vb0) {
      const [index, offset, size] = segment.vb0;
      pass.setVertexBuffer(1, gpu.buffer[index], offset, size);
    }
    if (segment.vb1) {
      const [index, offset, size] = segment.vb1;
      pass.setVertexBuffer(2, gpu.buffer[index], offset, size);
    }
    if (segment.ib) {
      const [index, offset, size] = segment.ib;
      pass.setIndexBuffer(gpu.buffer[index], "uint16", offset, size);
    }

    pass.drawIndexedIndirect(gpu.cbuffer[3], b.offset);
  }
  pass.end();
};

const $__gpuPassSSAO = (ce, gpu) => {
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
};

const $__gpuPassHDR = (ce, gpu) => {
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
  pass.setPipeline(gpu.pipeline[2]);
  pass.setBindGroup(0, gpu.bindGroup[1]);
  pass.draw(4);
  pass.setPipeline(gpu.pipeline[3]);
  pass.draw(4);
  pass.end();
};

const $__gpuPassLDR = (ce, gpu, tile) => {
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
  pass.setPipeline(gpu.pipeline[4]);
  pass.setBindGroup(0, gpu.bindGroup[3]);
  pass.draw(4);

  pass.setPipeline(gpu.pipeline[5]);
  pass.setBindGroup(0, gpu.bindGroup[0]);
  pass.setVertexBuffer(0, gpu.cbuffer[4]);
  pass.setVertexBuffer(1, gpu.cbuffer[5]);
  pass.draw(tile);

  pass.end();
};
