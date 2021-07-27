
class Core_Shader {
}

class Core_Sprite {
}

class Core_Mesh {
}

class Core_Camera {
}

class Core_Light {
}

class Core_Scene {
}

class Core_Graphics {
    constructor() {
        this.canvas_ = document.createElement("canvas");
        document.body.appendChild(this.canvas_);
        this.gl_ = this.canvas_.getContext("webgl");
    }

    render() {
        this.fitCanvasSize();
        this.clearCanvas();
    }

    fitCanvasSize() {
        const gl = this.gl_;
        const width = window.innerWidth;
        if(width !== gl.canvas.width) {
            gl.canvas.width = width;
        }
        const height = window.innerHeight;
        if(height !== gl.canvas.height) {
            gl.canvas.height = height;
        }
    }

    clearCanvas() {
        const gl = this.gl_;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
}
