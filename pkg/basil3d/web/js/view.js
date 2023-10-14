
const $viewReset = (view) => {
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

const $viewOpen = (view, desc) => {
  $__viewCamera(view, desc);
  $__viewLight(view, desc);
  $__viewRoom(view, desc);
  $__viewLines(view, desc);
};
