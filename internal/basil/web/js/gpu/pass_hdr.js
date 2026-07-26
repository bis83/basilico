const $__gpuPassHDR = (ce) => {
  const gpu = __gpu;
  const wgsl = $__ar0.wgsl;

  const pass = ce.beginRenderPass({
    depthStencilAttachment: {
      view: gpu.gbuffer[0].createView(),
      depthReadOnly: true,
    },
    colorAttachments: [
      {
        view: gpu.gbuffer[4].createView(),
        loadOp: "load",
        storeOp: "store",
      },
    ],
  });
  pass.setPipeline(wgsl.pipeline[2]);
  pass.setBindGroup(0, gpu.bindGroup[0]);
  pass.setBindGroup(1, gpu.bindGroup[1]);
  pass.draw(4);
  pass.setPipeline(wgsl.pipeline[3]);
  pass.draw(4);
  pass.end();
};
