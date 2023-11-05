
const $__funcInit = (app) => {
  if (app.func) {
    for (const name in app.func) {
      const func = app.func[name];
      if (func.target === "app") {
        $__funcCreate(app, name);
      }
    }
  }
};

const $__funcCreate = (app, name) => {
  app.view.func = app.view.func || [];
  app.view.func.push({
    name: name,
    branch: -1,
    action: -1,
  });
};

const $__funcBranchCondition = (app, func, fv, branch) => {
  return true;
};

const $__funcStepBranch = (app, func, fv) => {
  if (defined(func.branch[fv.branch])) {
    return func.branch[fv.branch];
  }
  for (let i = 0; i < func.branch.length; ++i) {
    if ($__funcBranchCondition(app, func, fv, i)) {
      fv.branch = i;
      fv.action = 0;
      return func.branch[i];
    }
  }
  return null;
};

const $__funcStepAction = (app, func, branch, fv) => {
  while (true) {
    const action = branch.action[fv.action];
    if (action) {
      const exec = app.exec[action];
      if (exec) {
        exec(app);
      }
      fv.action += 1;
    } else {
      fv.branch = -1;
      fv.action = -1;
      break;
    }
  }
};

const $__funcStep = (app, fv) => {
  const func = app.func[fv.name];
  if (!func) {
    return;
  }
  const branch = $__funcStepBranch(app, func, fv);
  if (!branch) {
    return;
  }
  $__funcStepAction(app, func, branch, fv);
};

const $__funcDispatch = (app) => {
  if (app.view.func) {
    for (const fv of app.view.func) {
      $__funcStep(app, fv);
    }
  }
};
