
const item_make = (slot) => {
  slot = slot || 0;

  const item = {
    s: [],
    i: 0,
  };
  item.s.length = slot;
  item.s.fill(null);
  item.i = 0;
  return item;
};

const item_index = (item, no) => {
  return item.s.findIndex(o => o && o.no === no);
};
const item_null_index = (item) => {
  return item.s.findIndex(o => !o);
};

const item_select = (item, i) => {
  const idx = (i == null) ? item.i : i;
  return item.s[idx];
};

const item_set_cursor = (item, offset) => {
  const idx = mod(item.i + offset, item.s.length);
  item.i = idx;
};

const item_gain = (item, no, count) => {
  let i = item_index(item, no);
  if (i < 0) {
    i = item_null_index(item);
    if (i < 0) {
      // full
      return;
    }
    item.s[i] = { no: no, n: count };
    return;
  }
  item.s[i].n += count;
};

const item_lose = (item, no, count) => {
  const i = item_index(item, no);
  if (i < 0) {
    return;
  }
  item.s[i].n -= count;
  if (item.s[i].n <= 0) {
    item.s[i] = null;
  }
};
