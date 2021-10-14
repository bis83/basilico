
const decodeUpdate = (data) => {
    return data;
};

const decodeDraw = (gl, data) => {
    if(data.prop) {
        data.prop = data.prop.map(data => {
            data.matrix = data.matrix ? base64ToFloat32Array(data.matrix) : null;
            return data;
        });
    }
    return data;
};

const decodeMesh = (gl, data) => {
    data.vao = gl.createVertexArray();
    gl.bindVertexArray(data.vao);
    if(data.b) {
        data.b = gl_staticBuffer(gl, gl.ARRAY_BUFFER, base64ToArrayBuffer(data.b));
        if(data.bv) {
            for(let i=0; i<data.bv.length; i+=2) {
                switch(data.bv[i]) {
                    case VS_LAYOUT_POSITION:
                        gl_bindVertexAttribArray(gl, VS_LAYOUT_POSITION, 3, gl.FLOAT, false, 0, data.bv[i+1]);
                        break;
                    case VS_LAYOUT_NORMAL:
                        gl_bindVertexAttribArray(gl, VS_LAYOUT_NORMAL, 3, gl.HALF_FLOAT, false, 0, data.bv[i+1]);
                        break;
                    case VS_LAYOUT_COLOR:
                        gl_bindVertexAttribArray(gl, VS_LAYOUT_COLOR, 4, gl.UNSIGNED_BYTE, true, 0, data.bv[i+1]);
                        break;
                    case VS_LAYOUT_UV:
                        gl_bindVertexAttribArray(gl, VS_LAYOUT_UV, 2, gl.HALF_FLOAT, false, 0, data.bv[i+1]);
                        break;
                }
            }
        }
    }
    if(data.i) {
        data.i = gl_staticBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, base64ToArrayBuffer(data.i));
    }
    gl.bindVertexArray(null);
    return data;
};

const decodeTexture = (gl, data) => {
    data.texture = gl_createGLTexture2D(gl, gl_renderText(data.text, data.width, data.height));
    return data;
};

const decodeShader = (gl, data) => {
    data.vertex_shader = gl_createGLShader(gl, gl.VERTEX_SHADER, data.vertex_shader);
    data.fragment_shader = gl_createGLShader(gl, gl.FRAGMENT_SHADER, data.fragment_shader);
    data.prog = gl_createGLProgram(gl, data.vertex_shader, data.fragment_shader);

    const umap = {};
    for(let u of data.uniform) {
        umap[u] = gl.getUniformLocation(data.prog, u);
    }
    data.uniform = umap;
    
    return data;
};
