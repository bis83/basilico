
const decodeTexture = (data) => {
    data.texture = gl_createGLTexture2D(gl_renderText(data.text, data.width, data.height));
    return data;
};
