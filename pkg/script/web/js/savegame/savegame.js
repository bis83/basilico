
const newgame = () => {
  grid_init_empty();
};

const loadgame = () => {
  const data = localstorage_get(`data${$view.slot}`);
  if (!data) {
    return false;
  }
  if (data.grid) {
    Object.assign($grid, grid_decode(data.grid));
  }
  return true;
};

const savegame = () => {
  const data = {};
  data.grid = grid_encode($grid);
  localstorage_set(`data${$view.slot}`, data);
};

const loadsystem = () => {
  const data = localstorage_get("system");
  if (!data) {
    return false;
  }
  // TODO:
  return true;
};

const savesystem = () => {
  const data = {};
  // TODO:
  localstorage_set("system", data);
};
