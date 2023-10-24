
const $start = async (setup, update) => {
  if (!navigator.gpu) {
    html_show_message("ERROR: WebGPU not supported.")
    return;
  }

  const app = {
    loading: 0,
  };
  $__onload(app);

  const frame = (time) => {
    if ($isLoadCompleted(app)) {
      $__funcFrameBegin(app.func, time);
      $__gpuFrameBegin(app.gpu);
      if (setup) {
        setup(app);
        setup = null;
      }
      if (update) {
        update(app);
      }
      $__gpuFrameEnd(app.gpu, app.view, app);
      $__funcFrameEnd(app.func);
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
};

const $isLoadCompleted = (app) => {
  return app.loading <= 0;
};

const $json = (app, name) => {
  return app.json[name];
};

const $room = (app, name) => {
  return app.room[name];
};
