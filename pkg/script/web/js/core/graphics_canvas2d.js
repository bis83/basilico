
const cvs_create = (width, height) => {
  const canvas = document.createElement("canvas");
  if (!canvas) {
    return null;
  }
  canvas.width = width;
  canvas.height = height;
  return canvas;
};

const cvs_text = (cvs, text) => {
  const context = cvs.getContext('2d');
  if (!context) {
    return null;
  }

  // clear 
  context.clearRect(0, 0, cvs.width, cvs.height);
  context.fillStyle = "rgba(0 0 0 / 0.5)";
  context.fillRect(0, 0, cvs.width, cvs.height);

  // render text
  context.fillStyle = "white";
  context.textAlign = "left";
  context.textBaseline = "top";
  context.font = "14px monospace";
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; ++i) {
    context.fillText(lines[i], 0, 12 * i);
  }
};
