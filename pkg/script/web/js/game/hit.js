
const hit_make = () => {
  return {
    no: 0,
    item: 0,
    act: false,
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

const hit_from_item = (hit, item) => {
  const slot = item_select(item);
  if (!slot) {
    return;
  }
  const data = data_item(slot.no);
  if (!data) {
    return;
  }
  if (!data.usable) {
    return;
  }
  hit.no = data.usable.hit;
  hit.item = item.no;
};

const hit_tick = (hit, mob) => {
  hit_from_item(hit, mob.item);
  if (hit.no > 0 && hit.act) {
    const data = data_hit(hit.no);
    if (!data) {
      return;
    }
    if (data.action) {
      action_invoke(mob, data.action);
    }
    hit.act = false;
  }
};
