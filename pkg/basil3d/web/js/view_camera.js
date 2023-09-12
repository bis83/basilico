
const basil3d_view_camera = (view, desc) => {
  if (desc.camera) {
    Object.assign(view.camera, desc.camera)
  }
};
