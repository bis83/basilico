
const tile_make = () => {
  return {
    base: [],
    no: 0,
    ha: 0,
  };
};

const tile_is_empty = (tile) => {
  if (!tile) {
    return true;
  }
  return (tile.base.length <= 0) && (tile.no <= 0);
};

const tile_is_full = (tile) => {
  if (!tile) {
    return false;
  }
  return (tile.no > 0);
};

const tile_is_noentry = (tile, h0) => {
  if (tile_is_empty(tile)) {
    return true;
  }
  if (tile_is_full(tile)) {
    return true;
  }
  const h1 = tile_height(tile);
  if (Math.abs(h0 - h1) > 1) {
    return true;
  }
  return false;
};

const tile_height = (tile) => {
  if (!tile) {
    return 0;
  }
  return tile.base.length;
};

const tile_set = (tile, no, ha) => {
  if (!tile) {
    return;
  }
  tile.no = no;
  tile.ha = ha || 0;
};

const tile_del = (tile) => {
  if (!tile) {
    return;
  }
  tile.no = 0;
  tile.ha = 0;
};

const tile_base_push = (tile, no) => {
  if (!tile) {
    return;
  }
  tile.base.push(no);
};

const tile_base_pop = (tile) => {
  if (!tile) {
    return;
  }
  tile.base.pop();
};
