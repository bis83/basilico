
const $__onload = (app) => {
  app.loading += 1;
  (async () => {
    const path = "app.json";
    const res = await fetch(path);
    const json = await res.json();
    if (json.gpu) {
      const device = app.gpu.device;
      if (json.gpu.buffer) {
        for (let i = 0; i < json.gpu.buffer.length; ++i) {
          const data = json.gpu.buffer[i];
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
          json.gpu.buffer[i] = buffer;
        }
      }
      if (json.gpu.shader) {
        for (let i = 0; i < json.gpu.shader.length; ++i) {
          const data = json.gpu.shader[i];
          const code = await $__decodeShaderEmbed(json.embed[data.embed]);
          const shader = device.createShaderModule({
            code: code,
          });
          json.gpu.shader[i] = shader;
        }
      }
      Object.assign(app.gpu, json.gpu);
      $__gpuInitPipeline(app.gpu);
    }
    if (json.audio) {
      Object.assign(app.audio, json.audio);
    }
    if (json.json) {
      app.json = json.json;
    }
    app.loading -= 1;
  })();
};
