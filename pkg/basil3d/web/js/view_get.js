
const $getOffset = (offset, x, y, z, ha, va) => {
  if (offset) {
    x += offset.x || 0;
    y += offset.y || 0;
    z += offset.z || 0;
    ha += offset.ha || 0;
    va += offset.va || 0;
  }
  return [x, y, z, ha, va];
};

const $getColor = (color, r, g, b, a) => {
  if (color) {
    if (color.r !== undefined) {
      r = color.r;
    }
    if (color.g !== undefined) {
      g = color.g;
    }
    if (color.r !== undefined) {
      b = color.b;
    }
    if (color.a !== undefined) {
      a = color.a;
    }
  }
  return [r, g, b, a];
};
