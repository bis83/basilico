
const makeGLTextureLoader = (gl) => {
    const createGLTexture2D = (img) => {
        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture
    };
    const renderText = (text, width, height) => {
        const canvas = document.createElement("canvas");
        if(!canvas) {
            LOGGING && console.log("FAILED: renderText");
            return null;
        }
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d');
        if(!context) {
            LOGGING && console.log("FAILED: renderText");
            return null;
        }
        context.fillStyle = "white";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "24px monospace";
        context.fillText(text, canvas.width/2, canvas.height/2);
        return canvas;
    };
    const makeText = (text, width, height) => {
        let texture = createGLTexture2D(renderText(text, width, height));
        const bind = (location) => {
            if(!texture) {
                LOGGING && console.log("ERROR: Texture has already released.");
                return;
            }
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.uniform1i(location, 0);
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

    // loader
    const map = {};
    const get = (name) => {
        return map[name];
    };
    const load = (data) => {
        map[data.name] = makeText(data.text, data.width, data.height);
    };
    return {
        get: get,
        load: load,
    };
};
