
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
    light: {
      ha: 0,
      va: 0,
      color: [0, 0, 0],
      ambient: [0, 0, 0],
    },
    entity: [],
  };
};

const basil3d_view_setup = (view, app, desc) => {
  if (desc.camera) {
    Object.assign(view.camera, desc.camera)
  }
  if (desc.light) {
    if (desc.light.ha !== undefined) {
      view.light.ha = desc.light.ha;
    }
    if (desc.light.va !== undefined) {
      view.light.va = desc.light.va;
    }
    if (desc.light.color) {
      view.light.color[0] = desc.light.color.r !== undefined ? desc.light.color.r : 0.0;
      view.light.color[1] = desc.light.color.g !== undefined ? desc.light.color.g : 0.0;
      view.light.color[2] = desc.light.color.b !== undefined ? desc.light.color.b : 0.0;
    }
    if (desc.light.ambient) {
      view.light.ambient[0] = desc.light.ambient.r !== undefined ? desc.light.ambient.r : 0.0;
      view.light.ambient[1] = desc.light.ambient.g !== undefined ? desc.light.ambient.g : 0.0;
      view.light.ambient[2] = desc.light.ambient.b !== undefined ? desc.light.ambient.b : 0.0;
    }
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
      const factor0 = [1.0, 1.0, 1.0, 1.0];
      if (e.albedo) {
        factor0[0] = e.albedo.r !== undefined ? e.albedo.r : 1.0;
        factor0[1] = e.albedo.g !== undefined ? e.albedo.g : 1.0;
        factor0[2] = e.albedo.b !== undefined ? e.albedo.b : 1.0;
        factor0[3] = e.albedo.a !== undefined ? e.albedo.a : 1.0;
      }
      const factor1 = [1.0, 0.5, 0.5, 0.0];
      if (e.occlusion !== undefined) {
        factor1[0] = e.occlusion;
      }
      if (e.metallic !== undefined) {
        factor1[1] = e.metallic;
      }
      if (e.roughness !== undefined) {
        factor1[2] = e.roughness;
      }
      if (e.emission !== undefined) {
        factor1[3] = e.emission;
      }
      view.entity.push({
        id: id,
        matrix: matrix,
        factor0: factor0,
        factor1: factor1,
      });
    }
  }
};
