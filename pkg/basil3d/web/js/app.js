
const basil3d_app_load = (device) => {
  const app = {
    gpu: {},
    audio: {},
    json: {},
    loading: 0,
  };
  const path = "app.json";
  fetch(path).then(res => res.json()).then((json) => {
    if (json.gpu) {
      json.gpu.buffer = json.gpu.buffer.map(data => {
        const binary = window.atob(json.embed[data.embed]);
        const buffer = device.createBuffer({
          size: binary.length,
          usage: GPUBufferUsage.VERTEX | GPUBufferUsage.INDEX,
          mappedAtCreation: true,
        });
        const view = new DataView(buffer.getMappedRange());
        for (let i = 0; i < binary.length; ++i) {
          view.setUint8(i, binary.charCodeAt(i));
        }
        buffer.unmap();
        return buffer;
      });
      app.gpu = json.gpu;
    }
    if (json.audio) {
      app.audio = json.audio;
    }
    if (json.json) {
      app.json = json.json;
    }
    app.loading -= 1;
  })
  app.loading += 1;

  return app;
};

const basil3d_app_is_loading = (app) => {
  return app.loading > 0;
};

const basil3d_app_gpu_id = (app, name) => {
  for (let i = 0; i < app.gpu.id.length; ++i) {
    if (app.gpu.id[i].name === name) {
      return i;
    }
  }
  return -1;
};

const basil3d_app_json = (app, name) => {
  return app.json[name];
};
