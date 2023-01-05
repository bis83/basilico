
const html_listen = (target, key, func) => {
  target.addEventListener(key, func);
};

const html_canvas = () => {
  return document.getElementById("main");
};

const html_hide_message = () => {
  const elem = document.getElementById("message");
  elem.style.display = `none`;
};
