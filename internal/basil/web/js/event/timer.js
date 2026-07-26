let __dt = 0;
let __now = 0;

const $__timer = (time) => {
  __dt = (time - __now) / 1000;
  __now = time;
};

const $dt = () => {
  return __dt;
};
