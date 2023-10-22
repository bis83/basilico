
const html_listen = (target, key, func) => {
  target.addEventListener(key, func);
};

const html_canvas = () => {
  return document.getElementById("canvas");
};

const html_message = () => {
  return document.getElementById("message");
};

const html_pointer_lock = () => {
  html_canvas().requestPointerLock();
};

const html_is_pointer_lock = () => {
  return document.pointerLockElement === html_canvas();
};

const html_show_message = (text) => {
  const elem = html_message();
  elem.style.display = ``;
  elem.textContent = text;
};

const html_hide_message = () => {
  const elem = html_message();
  elem.style.display = `none`;
};
