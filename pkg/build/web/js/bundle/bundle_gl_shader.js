

const makeGLShaderLoader = (gl) => {
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
    const linkProgram = (vertexShader, fragmentShader, uniform) => {
        const vs = createGLShader(gl.VERTEX_SHADER, vertexShader);
        if(!vs) {
            return null;
        }
        const fs = createGLShader(gl.FRAGMENT_SHADER, fragmentShader);
        if(!fs) {
            return null;
        }
        const prog = createGLProgram(vs, fs);
        if(!prog) {
            return null;
        }
        const obj = {
            use: () => { gl.useProgram(prog); }
        };
        for(let u of uniform) {
            obj[u] = gl.getUniformLocation(prog, u);
        }
        return obj;
    };

    // loader
    const map = {};
    const get = (name) => {
        return map[name];  
    };
    const load = (data) => {
        map[data.name] = linkProgram(data.vertex_shader, data.fragment_shader, data.uniform);
    };
    return {
        get: get,
        load: load,
    };
};
