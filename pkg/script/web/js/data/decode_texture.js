
let $imageLoading = 0;

const decodeTexture = (data) => {
    if(data.cvs) {
        const cvs = cvs_create(data.cvs.width, data.cvs.height);
        cvs_text(cvs, data.cvs.text);
        data.cvs = cvs;
        data.tex = gl_createGLTexture2D(data.cvs, data.s);
    } else {
        data.tex = null;

        const img = new Image();
        img.onload = () => {
            data.tex = gl_createGLTexture2D(img, data.s);
            $imageLoading -= 1;
        };
        img.src = "img/" + data.src;
        $imageLoading += 1;
    }
    return data;
};
