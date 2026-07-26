let __onupdate = () => {};

const __animationFrame = (time) => {
  $__timer(time);
  $__gpuDrawBegin();
  if ($__arLoadCompleted()) {
    __onupdate();
  }
  $__gpuDrawEnd();

  requestAnimationFrame(__animationFrame);
};

const __listenEvents = () => {
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

html_listen(window, "load", () => {
  (async () => {
    await $__gpuInit();
    $__audioInit();
    $__arInit();
    __listenEvents();
    requestAnimationFrame(__animationFrame);
  })();
});
