
const $__exec = {};

const $__stageStep = (app) => {
  const stage = $stageCurrent(app);
  if (!stage) {
    return;
  }
  const data = $stage(app, stage.name);
  if (!data) {
    return;
  }
  const items = data.step || [];
  const goto = (to) => {
    for (let i = 0; i < items.length; ++i) {
      if (items[i].label && items[i].label === to) {
        return i;
      }
    }
    return -1;
  };

  let yield = false;
  while (!yield) {
    const step = items[stage.step];
    if (step) {
      if (step.event) {
        const func = $__exec[step.event];
        if (func) {
          func(app);
        }
      }
      if (step.goto) {
        stage.step = goto(step.goto);
      } else {
        stage.step += 1;
      }
      if (step.yield) {
        yield = true;
      }
    } else {
      stage.step = -1;
      yield = true;
    }
  }
  if (stage.step < 0) {
    app.stage.pop();
  }
};

const $__stageNew = (app, name) => {
  const data = $stage(app, name);
  if (!data) {
    return;
  }
  const stage = {
    name: name,
    step: 0,
    room: structuredClone(data.room) || [],
    mob: structuredClone(data.mob) || [],
    camera: structuredClone(data.camera[0]),
    light: structuredClone(data.light[0]),
  };
  app.stage.push(stage);
};
