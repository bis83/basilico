
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
    object: [],
  };
};

const basil3d_scene_add_object = (scene, label, matrix) => {
  scene.object.push({
    label: label,
    matrix: matrix,
    offset: 0,
  });
};
