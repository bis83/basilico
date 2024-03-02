
const $__onload = (app, exec) => {
  app.loading += 1;
  (async () => {
    const path = "app.json";
    const res = await fetch(path);
    const json = await res.json();
    Object.assign(app, json);

    if (app.hid) {
      $__hidInit(app.hid);
    }
    if (app.gpu) {
      await $__gpuInit(app.gpu, app.embed);
    }

    app.view = {
      func: null,
      room: [],
      camera: {
        offset: {
          x: 0,
          y: 0,
          z: 0,
        },
        fov: 0,
        near: 0,
        far: 0,
      },
      light: {
        offset: {
          ha: 0,
          va: 0,
        },
        color: {
          r: 0,
          g: 0,
          b: 0,
        },
        ambient0: {
          r: 0,
          g: 0,
          b: 0,
        },
        ambient1: {
          r: 0,
          g: 0,
          b: 0,
        },
      },
    };

    app.exec = {};
    Object.assign(app.exec, exec);
    $__funcInit(app);

    delete app.embed;
    app.loading -= 1;
  })();
};
