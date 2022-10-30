
const draw_com = (com, no) => {
  const data = data_com(no);
  if (!data) {
    return;
  }
  if (!data.rect) {
    return;
  }
  if (data.rect.draw <= 0) {
    return;
  }
  draw_call(data.rect.draw, (u) => {
    $gl.uniformMatrix4fv(u.w, false, com.m);
    if (com.img) {
      gl_useTexture(com.img, u.tex0);
    }
  });
};
