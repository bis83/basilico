
const basil3d_gpu_on_frame_start = (gpu, device, canvas) => {
  // resize canvas and destroy render targets
  if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (gpu.texture[0] !== undefined) {
      gpu.texture[0].destroy();
      delete gpu.texture[0];
    }
    if (gpu.texture[1] !== undefined) {
      gpu.texture[1].destroy();
      delete gpu.texture[1];
    }
    if (gpu.bindGroup[1] !== undefined) {
      delete gpu.bindGroup[1];
    }
  }
  // create render targets
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
  if (gpu.bindGroup[1] === undefined) {
    gpu.bindGroup[1] = device.createBindGroup({
      layout: gpu.bindGroupLayout[1],
      entries: [
        { binding: 0, resource: gpu.texture[1].createView(), },
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

const basil3d_gpu_on_frame_scene = (gpu, device, context, canvas, scene, app) => {
  const batch = [];
  { // Upload Buffers
    const mat = new Float32Array(16);
    {
      scene.camera.aspect = canvas.width / canvas.height;
      const at = vec3add(scene.camera.eye, scene.camera.dir);
      const view = mat4lookat(scene.camera.eye, at, scene.camera.up);
      const proj = mat4perspective(scene.camera.fovy, scene.camera.aspect, scene.camera.zNear, scene.camera.zFar);
      const vp = mat4multiply(view, proj);
      mat.set(vp);
      device.queue.writeBuffer(gpu.buffer[0], 0, mat);
    }
    batch.length = app.gpu.mesh.length;
    for (let i = 0; i < batch.length; ++i) {
      batch[i] = [];
    }
    let offset = 0;
    for (const e of scene.entity) {
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
  { // Post-Process
    const pass = ce.beginRenderPass({
      colorAttachments: [{
        view: context.getCurrentTexture().createView(),
        clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
        loadOp: "clear",
        storeOp: "store",
      }],
    });
    pass.setPipeline(gpu.pipeline[1]);
    pass.setBindGroup(0, gpu.bindGroup[1]);
    pass.draw(4);
    pass.end();
  }
  device.queue.submit([ce.finish()]);
};
