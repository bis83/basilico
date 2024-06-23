
const $start = async () => {
  if (!navigator.gpu) {
    html_show_message("ERROR: WebGPU not supported.")
    return;
  }

  const app = {
    dt: 0,
    now: 0,
    data: {
      loading: 0,
    },
    hid: {
      map: {},
      last: 0,
    },
    stage: [],
  };
  $__onload(app);

  const frame = (time) => {
    app.dt = (time - app.now) / 1000;
    app.now = time;
    if ($isLoadCompleted(app)) {
      $__hidFrameBegin(app);
      $__gpuFrameBegin(app);
      $__stageStep(app);
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

const $stage = (app, name) => {
  return app.data.stage[name];
};

const $hid = (app, key) => {
  return $__hidMapGet(app.hid.map, key);
};

const $hidDelta = (app, key) => {
  return $__hidMapDelta(app.hid.map, key);
};

const $stageCurrent = (app) => {
  return app.stage.at(-1);
};
