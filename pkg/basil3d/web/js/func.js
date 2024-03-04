
const $__funcInit = (app) => {
  if (app.data.func) {
    $__funcCreate(app, "main");
  }
};

const $__funcCreate = (app, name) => {
  if (!defined(app.data.func[name])) {
    return;
  }
  app.func = app.func || [];
  app.func.push({
    name: name,
    branch: 0,
    action: 0,
  });
};

const $__funcStep = (app, fv) => {
  const func = app.data.func[fv.name];
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
  if (app.func) {
    const func = app.func;
    for (const fv of func) {
      $__funcStep(app, fv);
    }
    app.func = func.filter(fv => {
      return fv.branch >= 0;
    });
  }
};
