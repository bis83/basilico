
const basil3d_scene_create = () => {
  return {};
};

const basil3d_scene_render = (scene, app, gpu, pass) => {
  if (basil3d_app_is_loading(app)) {
    return;
  }
  basil3d_app_gpu_draw(app, "tr_01", gpu, pass);
};
