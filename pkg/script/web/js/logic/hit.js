
const hit_make = (no, item) => {
  return {
    no: no || 0,
    item: item || 0,
  };
};

const hit_ranges = (x, y, ha) => {
  const bx = Math.floor(x);
  const by = Math.floor(y);

  let ranges = [];

  const hr = deg2rad(ha);
  const tx = Math.floor(x + Math.cos(hr) * 0.8);
  const ty = Math.floor(y + Math.sin(hr) * 0.8);
  if (bx != tx || by != ty) {
    ranges.push({ x: tx, y: ty });
  }

  return ranges;
};
