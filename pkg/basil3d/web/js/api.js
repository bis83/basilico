
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
      $__hidFrameBegin(app.hid, time);
      $__gpuFrameBegin(app.gpu);
      $__funcDispatch(app);
      $__gpuFrameEnd(app.gpu, app.view, app);
      $__hidFrameEnd(app.hid);
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

const $hid = (app, key) => {
  return $__hidGet(app.hid.map, key);
};

const $hidDelta = (app, key) => {
  return $__hidDelta(app.hid.map, key);
};
