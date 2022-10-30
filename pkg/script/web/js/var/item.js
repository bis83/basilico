
const $item = {
  s: [],
  i: 0,
};

const item_index = (no) => {
  return $item.s.findIndex(o => o && o.no === no);
};
const item_null_index = () => {
  return $item.s.findIndex(o => !o);
};

const item_select = (i) => {
  const idx = (i == null) ? $item.i : i;
  return $item.s[idx];
};

const item_set_cursor = (offset) => {
  const idx = mod($item.i + offset, $item.s.length);
  $item.i = idx;
};

const item_gain = (no, num) => {
  let i = item_index(no);
  if (i < 0) {
    i = item_null_index();
    if (i < 0) {
      // full
      return;
    }
    $item.s[i] = { no: no, num: num };
    return;
  }
  $item.s[i].num += num;
};

const item_lose = (no, num) => {
  const i = item_index(no);
  if (i < 0) {
    return;
  }
  $item.s[i].num -= num;
  if ($item.s[i].num <= 0) {
    $item.s[i] = null;
  }
};

const item_init_empty = (slot) => {
  slot = slot || 0;

  $item.s.length = slot;
  $item.s.fill(null);
  $item.i = 0;
};

const item_encode = (data) => {
  return data;
};
const item_decode = (data) => {
  return data;
};
