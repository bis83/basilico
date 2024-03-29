
const $__gpuGBufferResize = (gpu) => {
  const device = gpu.device;
  const canvas = gpu.canvas;

  // resize canvas and destroy render targets
  if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const deleteTexture = (no) => {
      if (defined(gpu.gbuffer[no])) {
        gpu.gbuffer[no].destroy();
        delete gpu.gbuffer[no];
      }
    };
    deleteTexture(0);
    deleteTexture(1);
    deleteTexture(2);
    deleteTexture(3);
    deleteTexture(4);

    const deleteBindGroup = (no) => {
      if (defined(gpu.bindGroup[no])) {
        delete gpu.bindGroup[no];
      }
    };
    deleteBindGroup(1);
    deleteBindGroup(2);
    deleteBindGroup(3);
  }

  const createTexture = (i, format) => {
    if (!defined(gpu.gbuffer[i])) {
      gpu.gbuffer[i] = device.createTexture({
        size: [canvas.width, canvas.height],
        format: format,
        usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
      });
    }
  };
  createTexture(0, "depth32float");
  createTexture(1, "rgb10a2unorm");
  createTexture(2, "rgba8unorm");
  createTexture(3, "rgba8unorm");
  createTexture(4, "rgba16float");

  const createBindGroup = (i, t0, t1, t2, t3) => {
    if (!defined(gpu.bindGroup[i])) {
      gpu.bindGroup[i] = device.createBindGroup({
        layout: gpu.bindGroupLayout[1],
        entries: [
          { binding: 0, resource: { buffer: gpu.cbuffer[0] }, },
          { binding: 1, resource: gpu.gbuffer[t0].createView(), },
          { binding: 2, resource: gpu.gbuffer[t1].createView(), },
          { binding: 3, resource: gpu.gbuffer[t2].createView(), },
          { binding: 4, resource: gpu.gbuffer[t3].createView(), },
          { binding: 5, resource: gpu.sampler[0] },
        ],
      });
    }
  };
  createBindGroup(1, 0, 1, 2, 3);
  createBindGroup(2, 0, 1, 1, 1);
  createBindGroup(3, 0, 4, 4, 4);
};
