
const basil3d_view_light = (view, desc) => {
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
      view.light.color[3] = desc.light.color.a !== undefined ? desc.light.color.a : 0.0;
    }
    if (desc.light.ambient) {
      view.light.ambient[0] = desc.light.ambient.r !== undefined ? desc.light.ambient.r : 0.0;
      view.light.ambient[1] = desc.light.ambient.g !== undefined ? desc.light.ambient.g : 0.0;
      view.light.ambient[2] = desc.light.ambient.b !== undefined ? desc.light.ambient.b : 0.0;
      view.light.ambient[3] = desc.light.ambient.a !== undefined ? desc.light.ambient.a : 0.0;
    }
    if (desc.light.background) {
      view.light.background[0] = desc.light.background.r !== undefined ? desc.light.background.r : 0.0;
      view.light.background[1] = desc.light.background.g !== undefined ? desc.light.background.g : 0.0;
      view.light.background[2] = desc.light.background.b !== undefined ? desc.light.background.b : 0.0;
      view.light.background[3] = desc.light.background.a !== undefined ? desc.light.background.a : 0.0;
    }
  }
};
