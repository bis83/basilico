
class Sprite {
}

class Camera {
}

class Light {
}

class Mesh {
}

class Canvas {
    constructor() {
        this.canvas_ = document.createElement("canvas");
        document.body.appendChild(this.canvas_);
        this.gl_ = this.canvas_.getContext("webgl");
    }

    render() {
        const gl = this.gl_;
        const width = window.innerWidth;
        if(width !== gl.canvas.width) {
            gl.canvas.width = width;
        }
        const height = window.innerHeight;
        if(height !== gl.canvas.height) {
            gl.canvas.height = height;
        }
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
}
