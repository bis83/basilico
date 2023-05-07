
const basil3d_start = async () => {
  const adapter = await navigator.gpu.requestAdapter();
  const device = await adapter.requestDevice();

  const canvas = html_canvas();
  const context = canvas.getContext("webgpu");
  context.configure({
    device: device,
    format: navigator.gpu.getPreferredCanvasFormat(),
    alphaMode: "opaque",
  });

  const frame = () => {
    // resize canvas
    if (canvas.width !== window.innerWidth) {
      canvas.width = window.innerWidth;
    }
    if (canvas.height !== window.innerHeight) {
      canvas.height = window.innerHeight;
    }

    // start command encoder
    const ce = device.createCommandEncoder();

    // main pass
    const view = context.getCurrentTexture().createView();
    const renderPassDesc = {
      colorAttachments: [{
        view: view,
        clearValue: { r: 0.2, g: 0.2, b: 0.2, a: 1.0 },
        loadOp: "clear",
        storeOp: "store",
      }],
    };
    const pass = ce.beginRenderPass(renderPassDesc);
    pass.end();

    // submit
    device.queue.submit([ce.finish()]);
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
};
