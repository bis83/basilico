
const $view = {
  w: 0,
  h: 0,
  view: null,
  slot: 0,
  com: [],
  cam: {
    eye: [0, 0, 0],
    vp: new Float32Array(16),
    ivp: new Float32Array(16),
    o: new Float32Array(16),
  },
  m: new Float32Array(16),
};

const view_reset = () => {
  $view.view = $data.index.init;
  $view.slot = 0;
};

const view_camera_mob = () => {
  const data = data_view($view.view);
  if (!data) {
    return null;
  }
  if (!data.grid) {
    return null;
  }
  if (data.grid.cam <= 0) {
    return null;
  }
  return grid_mob(data.grid.cam);
};

const view_next = (view) => {
  const i = data_view_index(view);
  if (i < 0) {
    return;
  }
  $view.view = i;
};

const view_tick_before = () => {
  if ($view.view === null) {
    view_reset();
  }
  $view.w = window.innerWidth;
  $view.h = window.innerHeight;
};

const view_tick_after = () => {
  const fovy = deg2rad(30);
  const zNear = 0.1;
  const zFar = 1000;

  let dir = [1, 0, 0];
  let eye = [0, 0, 0];

  const mob = view_camera_mob();
  if (mob) {
    const EYE_HEIGHT = 1.75;
    dir = vec3dir(mob.ha, mob.va);
    eye = grid_coord_to_world(mob.x, mob.y, mob.h);
    eye[2] += EYE_HEIGHT;
  }

  const at = vec3add(eye, dir);
  const up = [0, 0, 1];
  const view = mat4lookat(eye, at, up);
  const proj = mat4perspective(fovy, $view.w / $view.h, zNear, zFar);
  const vp = mat4multiply(view, proj);
  $view.cam.vp.set(vp);
  $view.cam.ivp.set(mat4invert(vp));
  $view.cam.eye = eye;
  $view.cam.o.set(mat4ortho($view.w, $view.h, 0, 1));
};

const view_tick = () => {
  view_tick_before();
  const data = data_view($view.view);
  if (data) {
    for (const com of $view.com) {
      if (com) {
        com.value = null;
      }
    }
    if (data.com) {
      for (let no of data.com) {
        const data = data_com(no);
        if (!data) {
          continue;
        }
        if (!$view.com[no]) {
          $view.com[no] = com_make();
        }
        const com = $view.com[no];
        com_tick(com, data);
      }
    }
    if (data.grid) {
      grid_tick();
    }
  }
  view_tick_after();
};
