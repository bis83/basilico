
let $imageLoading = 0;

const decodeTexture = (data) => {
    if(data.cvs) {
        data.texture = gl_createGLTexture2D(gl_renderText(data.cvs.text, data.cvs.width, data.cvs.height), data.s);
    } else {
        data.texture = null;

        const img = new Image();
        img.onload = () => {
            data.texture = gl_createGLTexture2D(img, data.s);
            $imageLoading -= 1;
        };
        img.src = "img/" + data.src;
        $imageLoading += 1;
    }
    return data;
};
