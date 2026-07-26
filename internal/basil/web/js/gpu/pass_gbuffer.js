const $__gpuPassGBuffer = (ce) => {
  const gpu = __gpu;
  const wgsl = $__ar0.wgsl;
  const gltf = $__ar0.gltf;

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
      },
    ],
  });
  pass.setPipeline(wgsl.pipeline[0]);
  pass.setBindGroup(0, gpu.bindGroup[0]);
  for (const p of gpu.pass3d) {
    const input = gltf.input[p.id];
    if (!input) {
      continue;
    }
    pass.setVertexBuffer(0, gpu.cbuffer[2], p.slot * __strideOfDrawSlot);
    if (input.vb0) {
      const [index, offset, size] = input.vb0;
      pass.setVertexBuffer(1, gltf.buffer[index], offset, size);
    }
    if (input.vb1) {
      const [index, offset, size] = input.vb1;
      pass.setVertexBuffer(2, gltf.buffer[index], offset, size);
    }
    if (input.ib) {
      const [index, offset, size] = input.ib;
      pass.setIndexBuffer(gltf.buffer[index], "uint16", offset, size);
    }
    pass.drawIndexedIndirect(gpu.cbuffer[3], p.args * __strideOfDrawArgs);
  }
  pass.end();
};
