
const basil3d_view_create = () => {
  return {
    camera: {
      aspect: 1,
      fovy: deg2rad(30),
      zNear: 0.1,
      zFar: 1000,
      eye: [0, 0, 0],
      ha: 0,
      va: 0,
      up: [0, 1, 0],
    },
    entity: [],
  };
};

const basil3d_view_setup = (view, app, desc) => {
  if (desc.camera) {
    Object.assign(view.camera, desc.camera)
  }
  if (desc.entity) {
    for (const e of desc.entity) {
      const id = basil3d_app_gpu_id(app, e.name);
      if (id < 0) {
        continue;
      }
      const matrix = mat4identity();
      if (e.transform) {
        const x = e.transform.x || 0;
        const y = e.transform.y || 0;
        const z = e.transform.z || 0;
        mat4translated(matrix, x, y, z);
      }
      const albedo = [1.0, 1.0, 1.0, 1.0];
      if (e.albedo) {
        albedo[0] = e.albedo.r !== undefined ? e.albedo.r : 1.0;
        albedo[1] = e.albedo.g !== undefined ? e.albedo.g : 1.0;
        albedo[2] = e.albedo.b !== undefined ? e.albedo.b : 1.0;
        albedo[3] = e.albedo.a !== undefined ? e.albedo.a : 1.0;
      }
      view.entity.push({
        id: id,
        matrix: matrix,
        albedo: albedo,
      });
    }
  }
};
