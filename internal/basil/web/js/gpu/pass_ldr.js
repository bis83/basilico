const $__gpuPassLDR = (ce) => {
  const gpu = __gpu;
  const wgsl = $__ar0.wgsl;

  const pass = ce.beginRenderPass({
    depthStencilAttachment: {
      view: gpu.gbuffer[0].createView(),
      depthReadOnly: true,
    },
    colorAttachments: [
      {
        view: gpu.context.getCurrentTexture().createView(),
        clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 0.0 },
        loadOp: "clear",
        storeOp: "store",
      },
    ],
  });
  pass.setPipeline(wgsl.pipeline[4]);
  pass.setBindGroup(0, gpu.bindGroup[0]);
  pass.setBindGroup(1, gpu.bindGroup[3]);
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

const $__gpuPassLDRClear = (ce) => {
  const gpu = __gpu;

  const pass = ce.beginRenderPass({
    colorAttachments: [
      {
        view: gpu.context.getCurrentTexture().createView(),
        clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 0.0 },
        loadOp: "clear",
        storeOp: "store",
      },
    ],
  });
  pass.end();
};
