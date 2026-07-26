const $__onloadGLTF = async (gltf, embed) => {
  const device = __gpu.device;

  if (gltf.buffer) {
    for (let i = 0; i < gltf.buffer.length; ++i) {
      const data = gltf.buffer[i];
      const binary = await $__decodeBufferEmbed(embed[data.embed]);
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
      gltf.buffer[i] = buffer;
    }
  }
};
