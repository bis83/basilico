
const deg2rad = (deg) => {
  return (deg / 180) * Math.PI;
};

const xy_length = (x, y) => {
  return Math.sqrt(x * x + y * y);
};

const xy_normalize = (x, y) => {
  const l = xy_length(x, y);
  return l != 0 ? [x / l, y / l] : [0, 0];
};

const xy_reverse = ([x, y]) => {
  return [-x, -y];
};

const xy_mul = ([x, y], l) => {
  return [x * l, y * l];
};

const xy_hit_rect = ([x, y], minX, maxX, minY, maxY) => {
  return (minX <= x) && (x <= maxX) && (minY <= y) && (y <= maxY);
};

const xy_bounds = ([x0, y0], r, [x1, y1]) => {
  const [dx, dy] = [x1 - x0, y1 - y0];
  const l = xy_length(dx, dy);
  if (r <= l) {
    return [x0, y0];
  }
  const [nx, ny] = xy_normalize(dx, dy);
  const [sx, sy] = xy_mul([nx, ny], l - r);
  return [x0 + sx, y0 + sy];
};
