
var $gl = null;

const gl_init = () => {
  const canvas = document.getElementById("main");
  $gl = canvas.getContext("webgl2");
};
