
const cvs_create = (width, height) => {
    const canvas = document.createElement("canvas");
    if(!canvas) {
        LOGGING && console.log("FAILED: cvs_create");
        return null;
    }
    canvas.width = width;
    canvas.height = height;
    return canvas;
};

const cvs_text = (cvs, text) => {
    const context = cvs.getContext('2d');
    if(!context) {
        LOGGING && console.log("FAILED: cvs_create");
        return null;
    }
    context.clearRect(0, 0, cvs.width, cvs.height);
    context.fillStyle = "white";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "24px monospace";
    context.fillText(text, cvs.width/2, cvs.height/2);
};
