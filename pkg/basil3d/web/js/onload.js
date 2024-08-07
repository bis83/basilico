
const $__onload = (app) => {
  app.data.loading += 1;
  (async () => {
    const path = "app.json";
    const res = await fetch(path);
    const json = await res.json();

    const data = app.data;
    Object.assign(data, json);
    $__hidInit(app);
    if (data.gpu) {
      await $__gpuInit(data.gpu, data.embed);
    }
    $__stageNew(app, "main");

    delete data.embed;
    data.loading -= 1;
  })();
};

const $__onloadDone = (app) => {
  return app.data.loading <= 0;
};
