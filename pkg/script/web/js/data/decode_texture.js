
const decodeTexture = (data) => {
    if(data.cvs) {
        data.texture = gl_createGLTexture2D(gl_renderText(data.cvs.text, data.cvs.width, data.cvs.height));
    } else {
        data.texture = null;

        const img = new Image();
        img.onload = () => {
            data.texture = gl_createGLTexture2D(img);
        };
        img.src = "img/" + data.src;
    }
    return data;
};
