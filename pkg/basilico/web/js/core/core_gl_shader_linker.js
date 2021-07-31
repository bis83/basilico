
const GLES_VS_BASIC = `#version 300 es
void main() {
    float x = 0.5 * ((gl_VertexID & 0x1) == 0 ? -1.0 : 1.0);
    float y = 0.5 * ((gl_VertexID & 0x2) == 0 ? -1.0 : 1.0);
    gl_Position = vec4(x, y, 0, 1);
}`;

const GLES_FS_BASIC = `#version 300 es
precision mediump float;
out vec4 fc;
void main() {
    fc = vec4(1,0,0,1);
}`;

const LINKAGE_MAP = new Map([ 
    ["basic", {vs: GLES_VS_BASIC, fs: GLES_FS_BASIC}],
]);

const makeGLShaderLinker = (gl) => {
    const linked = new Map();

    const createGLShader = (type, source) => {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if(!success) {
            LOG(gl.getShaderInfoLog(shader));
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
            LOG(gl.getProgramInfoLog(prog));
            gl.deleteProgram(prog);
            return null;
        }
        return prog;
    };
    const linkProgram = (srcVS, srcFS) => {
        const vs = createGLShader(gl.VERTEX_SHADER, srcVS);
        if(!vs) {
            return null;
        }
        const fs = createGLShader(gl.FRAGMENT_SHADER, srcFS);
        if(!fs) {
            return null;
        }
        const prog = createGLProgram(vs, fs);
        if(!prog) {
            return null;
        }
        const use = () => {
            gl.useProgram(prog);
        };
        return {
            use: use,
        };
    };

    const link = (name) => {
        if(linked.has(name)) {
            return linked.get(name);
        } else {
            if(!LINKAGE_MAP.has(name)) {
                LOG("NOTFOUND: makeGLESProgram " + name);
                return null;
            }
            const l = LINKAGE_MAP.get(name);
            const prog = linkProgram(l.vs, l.fs);
            if(!prog) {
                LOG("FAILED: makeGLESProgram " + name);
                return null;            
            }
            linked.set(name, prog);
            return prog;
        }
    };
    return link;
};
