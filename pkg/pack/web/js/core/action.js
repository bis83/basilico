
const $action = {};
const action_invoke = (self, action) => {
  if (!action) {
    return;
  }
  for (const act of action) {
    const func = $action[act[0]];
    if (!func) {
      continue;
    }
    const args = act.slice(1);
    func(self, ...args);
  }
};

const define_action = (label, func) => {
  $action[label] = func;
};
