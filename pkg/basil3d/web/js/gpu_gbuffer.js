
const basil3d_gpu_gbuffer = (gpu, device, canvas) => {
  // resize canvas and destroy render targets
  if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const deleteTexture = (no) => {
      if (gpu.gbuffer[no] !== undefined) {
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
      if (gpu.bindGroup[no] !== undefined) {
        delete gpu.bindGroup[no];
      }
    };
    deleteBindGroup(1);
    deleteBindGroup(2);
    deleteBindGroup(3);
  }
  if (gpu.gbuffer[0] === undefined) {
    gpu.gbuffer[0] = device.createTexture({
      size: [canvas.width, canvas.height],
      format: "depth32float",
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });
  }
  if (gpu.gbuffer[1] === undefined) {
    gpu.gbuffer[1] = device.createTexture({
      size: [canvas.width, canvas.height],
      format: "rgb10a2unorm",
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });
  }
  if (gpu.gbuffer[2] === undefined) {
    gpu.gbuffer[2] = device.createTexture({
      size: [canvas.width, canvas.height],
      format: "rgba8unorm",
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });
  }
  if (gpu.gbuffer[3] === undefined) {
    gpu.gbuffer[3] = device.createTexture({
      size: [canvas.width, canvas.height],
      format: "rgba8unorm",
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });
  }
  if (gpu.gbuffer[4] === undefined) {
    gpu.gbuffer[4] = device.createTexture({
      size: [canvas.width, canvas.height],
      format: "rgba16float",
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });
  }
  if (gpu.bindGroup[1] === undefined) {
    gpu.bindGroup[1] = device.createBindGroup({
      layout: gpu.bindGroupLayout[1],
      entries: [
        { binding: 0, resource: { buffer: gpu.buffer[0] }, },
        { binding: 1, resource: gpu.gbuffer[0].createView(), },
        { binding: 2, resource: gpu.gbuffer[1].createView(), },
        { binding: 3, resource: gpu.gbuffer[2].createView(), },
        { binding: 4, resource: gpu.gbuffer[3].createView(), },
        { binding: 5, resource: gpu.sampler[0] },
      ],
    });
  }
  if (gpu.bindGroup[2] === undefined) {
    gpu.bindGroup[2] = device.createBindGroup({
      layout: gpu.bindGroupLayout[1],
      entries: [
        { binding: 0, resource: { buffer: gpu.buffer[0] }, },
        { binding: 1, resource: gpu.gbuffer[0].createView(), },
        { binding: 2, resource: gpu.gbuffer[1].createView(), },
        { binding: 3, resource: gpu.gbuffer[1].createView(), },
        { binding: 4, resource: gpu.gbuffer[1].createView(), },
        { binding: 5, resource: gpu.sampler[0] },
      ],
    });
  }
  if (gpu.bindGroup[3] === undefined) {
    gpu.bindGroup[3] = device.createBindGroup({
      layout: gpu.bindGroupLayout[1],
      entries: [
        { binding: 0, resource: { buffer: gpu.buffer[0] }, },
        { binding: 1, resource: gpu.gbuffer[0].createView(), },
        { binding: 2, resource: gpu.gbuffer[4].createView(), },
        { binding: 3, resource: gpu.gbuffer[4].createView(), },
        { binding: 4, resource: gpu.gbuffer[4].createView(), },
        { binding: 5, resource: gpu.sampler[0] },
      ],
    });
  }
};
