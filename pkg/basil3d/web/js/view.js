
const basil3d_view_create = () => {
  return {
    camera: {
      aspect: 1,
      fovy: deg2rad(30),
      zNear: 0.1,
      zFar: 1000,
      eye: [0, 0, 0],
      ha: 0,
      va: 0,
      up: [0, 1, 0],
    },
    light: {
      ha: 0,
      va: 0,
      color: [0, 0, 0],
      ambient: [0, 0, 0],
      background: [0, 0, 0],
    },
    room: [],
  };
};

const basil3d_view_setup = (view, app, desc) => {
  basil3d_view_camera(view, desc);
  basil3d_view_light(view, desc);
  basil3d_view_room(view, app, desc);
};
