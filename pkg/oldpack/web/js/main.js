
const init = () => {
  html_hide_message();
  gl_init();
  audio_init();
  listen_init();
  data_loadIndex();

  const tick = (time) => {
    update(time);
    draw();
    requestAnimationFrame(tick);
  };
  tick();
};

const update = (time) => {
  timer_tick(time);
  listen_tick();
  if (data_loaded()) {
    html_hide_message();
    view_tick();
  }
};

const draw = () => {
  draw_start_frame();
  if (data_loaded()) {
    draw_view();
  }
};

html_listen(window, "load", () => {
  html_listen(html_message(), "click", init);
});
