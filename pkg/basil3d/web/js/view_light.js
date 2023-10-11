
const basil3d_view_light = (view, desc) => {
  if (desc.light) {
    if (desc.light.ha !== undefined) {
      view.light.ha = desc.light.ha;
    }
    if (desc.light.va !== undefined) {
      view.light.va = desc.light.va;
    }
    view.light.color = basil3d_view_get_color(desc.light.color, 0, 0, 0, 0);
    view.light.ambient0 = basil3d_view_get_color(desc.light.ambient0, 0, 0, 0, 0);
    view.light.ambient1 = basil3d_view_get_color(desc.light.ambient1, 0, 0, 0, 0);
  }
};
