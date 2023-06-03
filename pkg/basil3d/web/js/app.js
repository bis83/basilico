
const basil3d_app_load = (device) => {
  const obj = {
    gpu: {},
    audio: {},
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
      obj.gpu = json.gpu;
    }
    if (json.audio) {
      obj.audio = json.audio;
    }
    obj.loading -= 1;
  })
  obj.loading += 1;

  return obj;
};

const basil3d_app_is_loading = (app) => {
  return app.loading > 0;
};

const basil3d_app_gpu_label_index = (app, name) => {
  for (let i = 0; i < app.gpu.label.length; ++i) {
    if (app.gpu.label[i].name === name) {
      return i;
    }
  }
  return -1;
};
