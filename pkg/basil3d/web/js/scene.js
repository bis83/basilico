
const basil3d_scene_create = () => {
  return {
    camera: {
      aspect: 1,
      fovy: deg2rad(30),
      zNear: 0.1,
      zFar: 1000,
      dir: [0, 0, 1],
      eye: [0, 0, 0],
      up: [0, 1, 0],
    },
    entity: [],
  };
};

const basil3d_scene_add_entity = (scene, app, label, matrix) => {
  const id = basil3d_app_gpu_label_index(app, label);
  if (id < 0) {
    return;
  }

  scene.entity.push({
    id: id,
    matrix: matrix,
  });
};
