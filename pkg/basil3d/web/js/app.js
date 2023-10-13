
const decodeEmbed = async (str) => {
  const base64 = window.atob(str);
  const bytes = new Uint8Array(base64.length);
  for (let i = 0; i < base64.length; ++i) {
    bytes[i] = base64.charCodeAt(i);
  }
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  const arrayBuffer = await new Response(stream).arrayBuffer();
  return new Uint8Array(arrayBuffer);
};

const basil3d_app_load = (app) => {
  app.loading += 1;
  (async () => {
    const path = "app.json";
    const res = await fetch(path);
    const json = await res.json();
    if (json.gpu) {
      const device = app.gpu.device;
      for (let i = 0; i < json.gpu.buffer.length; ++i) {
        const data = json.gpu.buffer[i];
        const binary = await decodeEmbed(json.embed[data.embed]);
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
      Object.assign(app.gpu, json.gpu);
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

const basil3d_gpu_id = (gpu, name) => {
  for (let i = 0; i < gpu.id.length; ++i) {
    if (gpu.id[i].name === name) {
      return i;
    }
  }
  return -1;
};
