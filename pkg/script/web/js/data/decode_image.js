
let $imageLoading = 0;

const decodeImage = (data) => {
    data.tex = null;

    const img = new Image();
    img.onload = () => {
        data.tex = gl_createGLTexture2D(img, data.s);
        $imageLoading -= 1;
    };
    img.src = "img/" + data.src;
    $imageLoading += 1;

    return data;
};
