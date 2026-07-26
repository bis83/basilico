const $draw = (id, slot, args) => {
  const gpu = __gpu;

  gpu.pass3d.push({
    id: id,
    slot: slot,
    args: args,
  });
};
