
var $gl = null;

const gl_init = () => {
  const canvas = document.getElementById("main");
  $gl = canvas.getContext("webgl2");
};

const hide_message = () => {
  const elem = document.getElementById("message");
  elem.style.display = `none`;
};
