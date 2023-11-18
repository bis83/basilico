
const $__funcInit = (app) => {
  if (app.func) {
    $__funcCreate(app, "main");
  }
};

const $__funcCreate = (app, name) => {
  if (!defined(app.func[name])) {
    return;
  }
  app.view.func = app.view.func || [];
  app.view.func.push({
    name: name,
    branch: 0,
    action: 0,
  });
};

const $__funcStep = (app, fv) => {
  const func = app.func[fv.name];
  if (!func) {
    fv.branch = -1;
    return;
  }
  while (true) {
    const branch = func.branch[fv.branch];
    if (!branch) {
      fv.branch = -1;
      break;
    }
    const action = branch.action[fv.action];
    if (!action) {
      fv.branch += branch.next;
      fv.action = 0;
      break;
    }
    const exec = app.exec[action];
    if (exec) {
      exec(app);
    }
    fv.action += 1;
  }
};

const $__funcDispatch = (app) => {
  const view = app.view;
  if (view.func) {
    const func = view.func;
    for (const fv of func) {
      $__funcStep(app, fv);
    }
    view.func = func.filter(fv => {
      return fv.branch >= 0;
    });
  }
};
