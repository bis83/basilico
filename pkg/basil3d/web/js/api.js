
const $start = async (exec) => {
  if (!navigator.gpu) {
    html_show_message("ERROR: WebGPU not supported.")
    return;
  }

  const app = {
    loading: 0,
  };
  $__onload(app, exec);

  const frame = (time) => {
    if ($isLoadCompleted(app)) {
      $__signalFrameBegin(app.signal, time);
      $__gpuFrameBegin(app.gpu);
      $__funcDispatch(app);
      $__gpuFrameEnd(app.gpu, app.view, app);
      $__signalFrameEnd(app.signal);
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

const $signal = (app, signal) => {
  return $__signalGet(app.signal.map, signal);
};
