
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

const basil3d_scene_setup = (scene, app, desc) => {
  if (desc.camera) {
    Object.assign(scene.camera, desc.camera)
  }
  if (desc.entity) {
    for (const e of desc.entity) {
      const id = basil3d_app_gpu_id(app, e.name);
      if (id < 0) {
        continue;
      }
      scene.entity.push({
        id: id,
        matrix: e.matrix,
      });
    }
  }
};
