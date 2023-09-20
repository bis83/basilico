
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
    if (desc.light.ambient0) {
      view.light.ambient0[0] = desc.light.ambient0.r !== undefined ? desc.light.ambient0.r : 0.0;
      view.light.ambient0[1] = desc.light.ambient0.g !== undefined ? desc.light.ambient0.g : 0.0;
      view.light.ambient0[2] = desc.light.ambient0.b !== undefined ? desc.light.ambient0.b : 0.0;
      view.light.ambient0[3] = desc.light.ambient0.a !== undefined ? desc.light.ambient0.a : 0.0;
    }
    if (desc.light.ambient1) {
      view.light.ambient1[0] = desc.light.ambient1.r !== undefined ? desc.light.ambient1.r : 0.0;
      view.light.ambient1[1] = desc.light.ambient1.g !== undefined ? desc.light.ambient1.g : 0.0;
      view.light.ambient1[2] = desc.light.ambient1.b !== undefined ? desc.light.ambient1.b : 0.0;
      view.light.ambient1[3] = desc.light.ambient1.a !== undefined ? desc.light.ambient1.a : 0.0;
    }
  }
};
