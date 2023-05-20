
const basil3d_scene_create = () => {
  return {};
};

const basil3d_scene_render = (scene, gpu, pass) => {
  pass.setPipeline(gpu.pipeline[0]);
  pass.setVertexBuffer(0, gpu.buffer[0]);
  pass.draw(3, 1, 0, 0);
};
