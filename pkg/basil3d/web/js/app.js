
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

const basil3d_app_gpu_label = (app, label) => {
  for (const obj of app.gpu.label) {
    if (obj.name === label) {
      return obj;
    }
  }
  return null;
};

const basil3d_app_gpu_draw = (app, label, gpu, pass) => {
  const obj = basil3d_app_gpu_label(app, label);
  if (!obj) {
    return;
  }
  for (const i of obj.mesh) {
    const mesh = app.gpu.mesh[i];
    pass.setPipeline(gpu.pipeline[0]);
    if (mesh.vb0) {
      const [index, offset, size] = mesh.vb0;
      pass.setVertexBuffer(0, app.gpu.buffer[index], offset, size);
    }
    if (mesh.ib) {
      const [index, offset, size] = mesh.ib;
      pass.setIndexBuffer(app.gpu.buffer[index], "uint16", offset, size);
    }
    pass.drawIndexed(mesh.count);
  }
};
