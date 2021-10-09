
const meshBuilder = (gl) => {
    const VS_LAYOUT_POSITION = 0;
    const VS_LAYOUT_NORMAL = 1;
    const VS_LAYOUT_COLOR = 2;
    const VS_LAYOUT_UV = 3;
    const TYPES = [null, gl.POINTS, gl.LINES, gl.TRIANGLES];
    const createBuffer = (type, data) => {
        let b = gl.createBuffer();
        gl.bindBuffer(type, b);
        gl.bufferData(type, data, gl.STATIC_DRAW);
        return b;
    };
    const bindAttribArray = (location, size, type, normalized, stride, offset) => {
        gl.enableVertexAttribArray(location);
        gl.vertexAttribPointer(location, size, type, normalized, stride, offset);
    };
    const createMeshBuffer = (data) => {
        if(!data.b) {
            return null;
        }
        const vb = createBuffer(gl.ARRAY_BUFFER, base64ToArrayBuffer(data.b));
        if(data.bv) {
            for(let i=0; i<data.bv.length; i+=2) {
                switch(data.bv[i]) {
                    case VS_LAYOUT_POSITION:
                        bindAttribArray(VS_LAYOUT_POSITION, 3, gl.FLOAT, false, 0, data.bv[i+1]);
                        break;
                    case VS_LAYOUT_NORMAL:
                        bindAttribArray(VS_LAYOUT_NORMAL, 3, gl.HALF_FLOAT, false, 0, data.bv[i+1]);
                        break;
                    case VS_LAYOUT_COLOR:
                        bindAttribArray(VS_LAYOUT_COLOR, 4, gl.UNSIGNED_BYTE, true, 0, data.bv[i+1]);
                        break;
                    case VS_LAYOUT_UV:
                        bindAttribArray(VS_LAYOUT_UV, 2, gl.HALF_FLOAT, false, 0, data.bv[i+1]);
                        break;
                }
            }
        }
        return vb;
    };
    const createMeshIndexBuffer = (data) => {
        if(!data.i) {
            return null;
        }
        const ib = createBuffer(gl.ELEMENT_ARRAY_BUFFER, base64ToArrayBuffer(data.i));
        return ib;
    };
    const build = (data) => {
        let vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        let b = createMeshBuffer(data);
        let ib = createMeshIndexBuffer(data);
        gl.bindVertexArray(null);

        const use = () => {
            gl.bindVertexArray(vao);
        }
        const draw = (no) => {
            no = no || 0;
            const mode = data.iv[no*3+0];
            const first = data.iv[no*3+1];
            const count = data.iv[no*3+2];
            if(ib) {
                gl.drawElements(TYPES[mode], count, gl.UNSIGNED_SHORT, 2*first);
            } else {
                gl.drawArrays(TYPES[mode], first, count);
            }
        };
        const obj = {
            name: data.name,
            use: use,
            draw: draw,
        };
        return obj;
    };
    return build;
};

const textureBulder = (gl) => {
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
    const build = (data) => {
        let texture = createGLTexture2D(renderText(data.text, data.width, data.height));
        const bind = (location) => {
            if(!texture) {
                LOGGING && console.log("ERROR: Texture has already released.");
                return;
            }
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.uniform1i(location, 0);
        };
        const obj = {
            name: data.name,
            bind: bind,
        };
        return obj;
    };
    return build;
};

const shaderBuilder = (gl) => {
    const createGLShader = (type, source) => {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if(!success) {
            LOGGING && console.log(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    };
    const createGLProgram = (vs, fs) => {
        const prog = gl.createProgram();
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);
        const success = gl.getProgramParameter(prog, gl.LINK_STATUS);
        if(!success) {
            LOGGING && console.log(gl.getProgramInfoLog(prog));
            gl.deleteProgram(prog);
            return null;
        }
        return prog;
    };
    const build = (data) => {
        const vs = createGLShader(gl.VERTEX_SHADER, data.vertex_shader);
        if(!vs) {
            return null;
        }
        const fs = createGLShader(gl.FRAGMENT_SHADER, data.fragment_shader);
        if(!fs) {
            return null;
        }
        const prog = createGLProgram(vs, fs);
        if(!prog) {
            return null;
        }
        const obj = {
            name: data.name,
            use: () => { gl.useProgram(prog); },
        };
        for(let u of data.uniform) {
            obj[u] = gl.getUniformLocation(prog, u);
        }
        return obj;
    };
    return build;
};

const buildUpdate = (data) => {
    return data;
};

const buildDraw = (data) => {
    if(data.prop) {
        data.prop = data.prop.map(data => {
            data.matrix = data.matrix ? base64ToFloat32Array(data.matrix) : null;
            return data;
        });
    }
    return data;
};

const makeStoreData = (gl, audio) => {
    const bundles = [];
    const find = (type, name) => {
        for(const b of bundles) {
            if(!b[type]) {
                continue;
            }
            const item = b[type].find(item => item.name === name);
            if(!item) {
                continue;
            }
            return item;
        }
        return null;
    };

    const buildMesh = meshBuilder(gl);
    const buildTexture = textureBulder(gl);
    const buildShader = shaderBuilder(gl);
    const load = (name) => {
        const path = "data/" + name + ".json";
        fetch(path).then(res => res.json()).then((json) => {
            if(json.update) {
                json.update = json.update.map(data => buildUpdate(data));
            }
            if(json.draw) {
                json.draw = json.draw.map(data => buildDraw(data));
            }
            if(json.mesh) {
                json.mesh = json.mesh.map(data => buildMesh(data));
            }
            if(json.texture) {
                json.texture = json.texture.map(data => buildTexture(data));
            }
            if(json.shader) {
                json.shader = json.shader.map(data => buildShader(data));
            }
            bundles.push(json);
        });
    };
    return {
        draw: (name) => find("draw", name),
        mesh: (name) => find("mesh", name),
        texture: (name) => find("texture", name),
        shader: (name) => find("shader", name),
        action: {
            load: load,
        }
    };
};
