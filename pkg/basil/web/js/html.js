
const html_listen = (target, key, func) => {
  target.addEventListener(key, func);
};

const html_canvas = () => {
  return document.getElementById("canvas");
};

const html_message = () => {
  return document.getElementById("message");
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
