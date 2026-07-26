const $__gpuPassSSAO = (ce) => {
  const gpu = __gpu;
  const wgsl = $ar[0].wgsl;

  const pass = ce.beginRenderPass({
    colorAttachments: [
      {
        view: gpu.gbuffer[3].createView(),
        loadOp: "load",
        storeOp: "store",
      },
    ],
  });
  pass.setPipeline(wgsl.pipeline[1]);
  pass.setBindGroup(0, gpu.bindGroup[0]);
  pass.setBindGroup(1, gpu.bindGroup[2]);
  pass.draw(4);
  pass.end();
};
