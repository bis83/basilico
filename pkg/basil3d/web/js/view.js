
const basil3d_view_create = () => {
  const view = {};
  basil3d_view_reset(view);
  return view;
};

const basil3d_view_reset = (view) => {
  view.camera = {
    eye: [0, 0, 0],
    ha: 0,
    va: 0,
    fov: 30,
    near: 0.1,
    far: 1000,
  };
  view.light = {
    ha: 0,
    va: 0,
    color: [0, 0, 0, 0],
    ambient0: [0, 0, 0, 0],
    ambient1: [0, 0, 0, 0],
  };
  view.room = [];
  view.celeste = [];
  view.mob = [];
  view.lines = [];
};

const basil3d_view_open = (view, app, desc) => {
  basil3d_view_camera(view, desc);
  basil3d_view_light(view, desc);
  basil3d_view_room(view, app, desc);
  basil3d_view_lines(view, desc);
};
