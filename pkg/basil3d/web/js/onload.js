
const $__onload = (app) => {
  app.loading += 1;
  (async () => {
    const path = "app.json";
    const res = await fetch(path);
    const json = await res.json();
    Object.assign(app, json);

    if (app.gpu) {
      await $__gpuInit(app.gpu, app.embed);
    }
    if (app.func) {
      $__funcInit(app.func);
    }

    delete app.embed;
    app.loading -= 1;
  })();
};
