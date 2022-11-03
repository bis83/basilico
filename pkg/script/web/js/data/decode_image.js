
let $imageLoading = 0;

const decodeImage = (data, base64) => {
  data.tex = null;

  const img = new Image();
  img.onload = () => {
    data.tex = gl_createGLTexture2D(img, data.s);
    $imageLoading -= 1;
  };
  img.src = "data:image/png;base64," + base64[data.b];
  $imageLoading += 1;

  return data;
};
