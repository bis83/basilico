
const $__viewLight = (view, desc) => {
  if (desc.light) {
    if (desc.light.ha !== undefined) {
      view.light.ha = desc.light.ha;
    }
    if (desc.light.va !== undefined) {
      view.light.va = desc.light.va;
    }
    view.light.color = $getColor(desc.light.color, 0, 0, 0, 0);
    view.light.ambient0 = $getColor(desc.light.ambient0, 0, 0, 0, 0);
    view.light.ambient1 = $getColor(desc.light.ambient1, 0, 0, 0, 0);
  }
};
