let __dt = 0;
let __now = 0;
let __onupdate = () => {};

const $__listenInit = () => {
  html_listen(document.body, "contextmenu", (ev) => {
    ev.preventDefault();
  });
  html_listen(window, "blur", (ev) => {});
  html_listen(document, "click", (ev) => {
    $__audioResume();
  });
  html_listen(document, "keydown", (ev) => {});
  html_listen(document, "keyup", (ev) => {});
  html_listen(document, "mousedown", (ev) => {});
  html_listen(document, "mouseup", (ev) => {});
  html_listen(document, "mousemove", (ev) => {});
  html_listen(document, "touchstart", (ev) => {});
  html_listen(document, "touchend", (ev) => {});
  html_listen(document, "touchmove", (ev) => {});
  html_listen(document, "touchcancel", (ev) => {});
  html_listen(document, "gamepadconnected", (ev) => {});
  html_listen(document, "gamepaddisconnected", (ev) => {});
};

const $__frame = (time) => {
  __dt = (time - __now) / 1000;
  __now = time;

  $__gpuFrameBegin();
  if ($__onloadDone()) {
    __onupdate();
  }
  $__gpuFrameEnd();

  requestAnimationFrame($__frame);
};

const $onload = async () => {
  await $__gpuInit();
  $__audioInit();
  $__listenInit();
  $__onload();
  requestAnimationFrame($__frame);
};

const $dt = () => {
  return __dt;
};
