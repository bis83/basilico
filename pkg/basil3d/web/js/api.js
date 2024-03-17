
const $start = async () => {
  if (!navigator.gpu) {
    html_show_message("ERROR: WebGPU not supported.")
    return;
  }

  const app = {
    data: {
      loading: 0,
    },
    hid: {
      map: {},
      last: 0,
    },
    func: [],
    room: [],
    mob: [],
    hud: [],
    camera: {
      offset: {
        x: 0,
        y: 0,
        z: 0,
      },
      fov: 0,
      near: 0,
      far: 0,
    },
    light: {
      offset: {
        ha: 0,
        va: 0,
      },
      color: {
        r: 0,
        g: 0,
        b: 0,
      },
      ambient0: {
        r: 0,
        g: 0,
        b: 0,
      },
      ambient1: {
        r: 0,
        g: 0,
        b: 0,
      },
    },
  };
  $__onload(app);

  const frame = (time) => {
    if ($isLoadCompleted(app)) {
      $__hidFrameBegin(app, time);
      $__gpuFrameBegin(app);
      $__funcDispatch(app);
      $__gpuFrameEnd(app);
      $__hidFrameEnd(app);
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
};

const $isLoadCompleted = (app) => {
  return app.data.loading <= 0;
};

const $json = (app, name) => {
  return app.data.json[name];
};

const $room = (app, name) => {
  return app.data.room[name];
};

const $mob = (app, name) => {
  return app.data.mob[name];
};

const $hid = (app, key) => {
  return $__hidMapGet(app.hid.map, key);
};

const $hidDelta = (app, key) => {
  return $__hidMapDelta(app.hid.map, key);
};
