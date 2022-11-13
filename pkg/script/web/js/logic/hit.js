
const hit_make = (no, item) => {
  return {
    no: no || 0,
    item: item || 0,
  };
};

const hit_ranges = (x, y, ha) => {
  let ranges = [];

  const h = deg2rad(ha);
  x += Math.cos(h) * 0.8;
  y += Math.sin(h) * 0.8;
  x = Math.floor(x);
  y = Math.floor(y);
  ranges.push({ x: x, y: y });

  return ranges;
};
