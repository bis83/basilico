
$hit = [];

const hit_add = (hit) => {
  $hit.push(hit);
};

const hit_tick = () => {
  for (const hit of $hit) {
  }
  $hit.length = 0;
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

const HIT_ACTIVATE = 1;
const HIT_MINING = 2;
const HIT_DIG = 3;
const HIT_PUT = 4;

const hit_activate = (ranges) => {
  let result = 0;
  for (const r of ranges) {
    const tile = grid_tile(r.x, r.y);
    if (!tile) {
      continue;
    }
    const data = data_tile(tile.no);
    if (!data) {
      continue;
    }
    if (data.device) {
      action_invoke(tile, data.device.action);
      result += 1;
    }
  }
  return result;
}

const hit_mining = (ranges) => {
  let result = 0;
  for (const r of ranges) {
    const tile = grid_tile(r.x, r.y);
    if (!tile) {
      continue;
    }
    const data = data_tile(tile.no);
    if (!data) {
      continue;
    }
    if (data.mine) {
      item_gain(data.mine.item, data.mine.count);
      tile_del(tile);
      result += 1;
    }
  }
  return result;
};

const hit_dig = (ranges) => {
  let result = 0;
  for (const r of ranges) {
    const tile = grid_tile(r.x, r.y);
    if (tile_is_empty(tile)) {
      continue;
    }
    if (tile_is_full(tile)) {
      continue;
    }
    tile_base_pop(tile);
    result += 1;
  }
  return result;
}

const hit_put = (value, ranges) => {
  let result = 0;
  for (const r of ranges) {
    const tile = grid_tile(r.x, r.y);
    if (tile_is_full(tile)) {
      continue;
    }
    tile_base_push(tile, value);
    result += 1;
  }
  return result;
};

const hit = (hit, value, ranges) => {
  if (hit === HIT_ACTIVATE) {
    return hit_activate(ranges);
  }
  if (hit === HIT_MINING) {
    return hit_mining(ranges);
  }
  if (hit === HIT_DIG) {
    return hit_dig(ranges);
  }
  if (hit === HIT_PUT) {
    return hit_put(value, ranges);
  }
  return 0;
};
