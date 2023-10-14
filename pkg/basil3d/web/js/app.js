
const decodeBufferEmbed = async (str) => {
  const base64 = window.atob(str);
  const bytes = new Uint8Array(base64.length);
  for (let i = 0; i < base64.length; ++i) {
    bytes[i] = base64.charCodeAt(i);
  }
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  const arrayBuffer = await new Response(stream).arrayBuffer();
  return new Uint8Array(arrayBuffer);
};

const decodeShaderEmbed = async (str) => {
  const base64 = window.atob(str);
  const bytes = new Uint8Array(base64.length);
  for (let i = 0; i < base64.length; ++i) {
    bytes[i] = base64.charCodeAt(i);
  }
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  const text = await new Response(stream).text();
  return text;
};

const basil3d_app_load = (app) => {
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
          const binary = await decodeBufferEmbed(json.embed[data.embed]);
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
          const code = await decodeShaderEmbed(json.embed[data.embed]);
          const shader = device.createShaderModule({
            code: code,
          });
          json.gpu.shader[i] = shader;
        }
      }
      Object.assign(app.gpu, json.gpu);
      basil3d_gpu_init_pipeline(app.gpu);
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

const basil3d_app_is_loading = (app) => {
  return app.loading > 0;
};

const basil3d_app_json = (app, name) => {
  return app.json[name];
};
