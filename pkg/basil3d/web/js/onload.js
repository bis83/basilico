
const $__onload = (app) => {
  app.loading += 1;
  (async () => {
    const path = "app.json";
    const res = await fetch(path);
    const json = await res.json();
    Object.assign(app, json);

    if (app.gpu) {
      const gpu = app.gpu;
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
      if (gpu.buffer) {
        for (let i = 0; i < gpu.buffer.length; ++i) {
          const data = gpu.buffer[i];
          const binary = await $__decodeBufferEmbed(json.embed[data.embed]);
          const buffer = device.createBuffer({
            size: binary.length,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.INDEX,
            mappedAtCreation: true,
          });
          const view = new DataView(buffer.getMappedRange());
          for (let i = 0; i < binary.length; ++i) {
            view.setUint8(i, binary[i]);
          }
          buffer.unmap();
          gpu.buffer[i] = buffer;
        }
      }
      if (gpu.shader) {
        for (let i = 0; i < gpu.shader.length; ++i) {
          const data = gpu.shader[i];
          const code = await $__decodeShaderEmbed(json.embed[data.embed]);
          const shader = device.createShaderModule({
            code: code,
          });
          gpu.shader[i] = shader;
        }
      }
      $__gpuInit(app.gpu);
      $__gpuInitPipeline(app.gpu);
    }
    if (app.listen) {
      $__listenInit(app.listen);
    }
    if (app.view) {
      $viewReset(app.view);
    }

    delete app.embed;
    app.loading -= 1;
  })();
};
