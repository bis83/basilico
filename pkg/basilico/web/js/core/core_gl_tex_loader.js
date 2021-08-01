
const makeGLTexLoader = (gl) => {
    const makeText = (text, width, height) => {
        const renderText = (text) => {
            const canvas = document.createElement("canvas");
            if(!canvas) {
                LOG("FAILED: renderText");
                return null;
            }
            canvas.width = width;
            canvas.height = height;

            const context = canvas.getContext('2d');
            if(!context) {
                LOG("FAILED: renderText");
                return null;
            }
            context.fillStyle = "white";
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.font = "24px monospace";
            context.fillText(text, canvas.width/2, canvas.height/2);
            return canvas;
        };

        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, renderText(text));
        gl.bindTexture(gl.TEXTURE_2D, null);
        const bind = () => {
            if(!texture) {
                LOG("ERROR: Texture has already released.");
                return;
            }
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture);
        };
        const dispose = () => {
            if(!texture) {
                gl.deleteTexture(texture);
                texture = null;
            }
        };
        return {
            bind: bind,
            dispose: dispose,
        }
    };
    return {
        makeText: makeText,
    };
};
