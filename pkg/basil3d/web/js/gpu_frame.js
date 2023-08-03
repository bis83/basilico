
const basil3d_gpu_on_frame_start = (gpu, device, canvas) => {
  // resize canvas and destroy render targets
  if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const deleteTexture = (no) => {
      if (gpu.texture[no] !== undefined) {
        gpu.texture[no].destroy();
        delete gpu.texture[no];
      }
    };
    deleteTexture(0);
    deleteTexture(1);
    deleteTexture(2);

    const deleteBindGroup = (no) => {
      if (gpu.bindGroup[no] !== undefined) {
        delete gpu.bindGroup[no];
      }
    };
    deleteBindGroup(1);
    deleteBindGroup(2);
  }
  if (gpu.texture[0] === undefined) {
    gpu.texture[0] = device.createTexture({
      size: [canvas.width, canvas.height],
      format: "depth24plus",
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });
  }
  if (gpu.texture[1] === undefined) {
    gpu.texture[1] = device.createTexture({
      size: [canvas.width, canvas.height],
      format: "rgb10a2unorm",
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });
  }
  if (gpu.texture[2] === undefined) {
    gpu.texture[2] = device.createTexture({
      size: [canvas.width, canvas.height],
      format: "rgba16float",
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });
  }
  if (gpu.bindGroup[1] === undefined) {
    gpu.bindGroup[1] = device.createBindGroup({
      layout: gpu.bindGroupLayout[1],
      entries: [
        { binding: 0, resource: gpu.texture[1].createView(), },
        { binding: 1, resource: gpu.sampler[0] },
      ],
    });
  }
  if (gpu.bindGroup[2] === undefined) {
    gpu.bindGroup[2] = device.createBindGroup({
      layout: gpu.bindGroupLayout[1],
      entries: [
        { binding: 0, resource: gpu.texture[2].createView(), },
        { binding: 1, resource: gpu.sampler[0] },
      ],
    });
  }
};

const basil3d_gpu_on_frame_loading = (gpu, device, context) => {
  const ce = device.createCommandEncoder();
  const pass = ce.beginRenderPass({
    colorAttachments: [{
      view: context.getCurrentTexture().createView(),
      clearValue: { r: 0.2, g: 0.2, b: 0.2, a: 1.0 },
      loadOp: "clear",
      storeOp: "store",
    }],
  });
  pass.end();
  device.queue.submit([ce.finish()]);
};

const basil3d_gpu_on_frame_view = (gpu, device, context, canvas, app, view) => {
  const batch = [];
  { // Upload Buffers
    const mat = new Float32Array(16);
    {
      const camera = view.camera;
      camera.aspect = canvas.width / canvas.height;
      const dir = vec3dir(camera.ha, camera.va);
      const at = vec3add(camera.eye, dir);
      const look = mat4lookat(camera.eye, at, camera.up);
      const proj = mat4perspective(camera.fovy, camera.aspect, camera.zNear, camera.zFar);
      const vp = mat4multiply(look, proj);
      mat.set(vp);
      device.queue.writeBuffer(gpu.buffer[0], 0, mat);
    }
    batch.length = app.gpu.mesh.length;
    for (let i = 0; i < batch.length; ++i) {
      batch[i] = [];
    }
    let offset = 0;
    for (const e of view.entity) {
      for (const i of app.gpu.id[e.id].mesh) {
        batch[i].push(offset);
      }
      mat.set(e.matrix);
      device.queue.writeBuffer(gpu.buffer[1], offset, mat);
      offset += 256;
    }
  }
  const ce = device.createCommandEncoder();
  { // Write G-Buffer
    const pass = ce.beginRenderPass({
      depthStencilAttachment: {
        view: gpu.texture[0].createView(),
        depthClearValue: 1.0,
        depthLoadOp: "clear",
        depthStoreOp: "store",
      },
      colorAttachments: [{
        view: gpu.texture[1].createView(),
        clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 0.0 },
        loadOp: "clear",
        storeOp: "store",
      }],
    });
    for (let i = 0; i < batch.length; ++i) {
      if (batch[i].length <= 0) {
        continue;
      }

      const mesh = app.gpu.mesh[i];
      pass.setPipeline(gpu.pipeline[0]);
      if (mesh.vb0) {
        const [index, offset, size] = mesh.vb0;
        pass.setVertexBuffer(0, app.gpu.buffer[index], offset, size);
      }
      if (mesh.vb1) {
        const [index, offset, size] = mesh.vb1;
        pass.setVertexBuffer(1, app.gpu.buffer[index], offset, size);
      }
      if (mesh.ib) {
        const [index, offset, size] = mesh.ib;
        pass.setIndexBuffer(app.gpu.buffer[index], "uint16", offset, size);
      }

      for (const offset of batch[i]) {
        pass.setBindGroup(0, gpu.bindGroup[0], [offset]);
        pass.drawIndexed(mesh.count);
      }
    }
    pass.end();
  }
  { // HDR Color-Space
    const pass = ce.beginRenderPass({
      depthStencilAttachment: {
        view: gpu.texture[0].createView(),
        depthReadOnly: true,
      },
      colorAttachments: [{
        view: gpu.texture[2].createView(),
        clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 0.0 },
        loadOp: "clear",
        storeOp: "store",
      }],
    });
    pass.setPipeline(gpu.pipeline[1]);
    pass.setBindGroup(0, gpu.bindGroup[1]);
    pass.draw(4);
    pass.setPipeline(gpu.pipeline[2]);
    pass.draw(4);
    pass.end();
  }
  { // LDR Color-Space
    const pass = ce.beginRenderPass({
      colorAttachments: [{
        view: context.getCurrentTexture().createView(),
        clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 0.0 },
        loadOp: "clear",
        storeOp: "store",
      }],
    });
    pass.setPipeline(gpu.pipeline[3]);
    pass.setBindGroup(0, gpu.bindGroup[2]);
    pass.draw(4);
    pass.end();
  }
  device.queue.submit([ce.finish()]);
};
