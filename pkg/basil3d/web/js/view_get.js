
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
    if (defined(color.r)) {
      r = color.r;
    }
    if (defined(color.g)) {
      g = color.g;
    }
    if (defined(color.r)) {
      b = color.b;
    }
    if (defined(color.a)) {
      a = color.a;
    }
  }
  return [r, g, b, a];
};
