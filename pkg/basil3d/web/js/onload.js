
const $__onload = (app, exec) => {
  app.loading += 1;
  (async () => {
    const path = "app.json";
    const res = await fetch(path);
    const json = await res.json();
    Object.assign(app, json);

    if (app.gpu) {
      await $__gpuInit(app.gpu, app.embed);
    }
    if (app.signal) {
      $__signalInit(app.signal);
    }

    app.exec = {};
    Object.assign(app.exec, exec);
    $__funcInit(app);

    delete app.embed;
    app.loading -= 1;
  })();
};
