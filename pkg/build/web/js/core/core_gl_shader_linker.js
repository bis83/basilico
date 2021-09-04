
const GLES_VERSION = "#version 300 es\n";
const GLES_FS_PRECISION = "precision mediump float;";
const GLES_FS_OUTPUT = "out vec4 fc;";
const GLES_UNIFORM_COLOR = "uniform vec4 col;";
const GLES_UNIFORM_TEXTURE = "uniform sampler2D tex;";
const GLES_MAIN_BEGIN = "void main() {";
const GLES_MAIN_END = "}";
const GLES_VS_RECT = [
    "out vec2 uv;",
    "uniform vec4 xywh;",
    GLES_MAIN_BEGIN,
    "float x = xywh.x + xywh.z * ((gl_VertexID & 0x1) == 0 ? -1.0 : 1.0);",
    "float y = xywh.y - xywh.w * ((gl_VertexID & 0x2) == 0 ? -1.0 : 1.0);",
    "gl_Position = vec4(x, y, 0, 1);",
    "float u = (gl_VertexID & 0x1) == 0 ? 0.0 : 1.0;",
    "float v = (gl_VertexID & 0x2) == 0 ? 0.0 : 1.0;",
    "uv = vec2(u,v);",
    GLES_MAIN_END,
].join("");
const GLES_FS_RECT = [
    GLES_FS_PRECISION,
    GLES_FS_OUTPUT,
    GLES_UNIFORM_COLOR,
    "void main() { fc = col; }",
].join("");
const GLES_FS_RECT_TEX = [
    GLES_FS_PRECISION,
    GLES_FS_OUTPUT,
    GLES_UNIFORM_COLOR,
    GLES_UNIFORM_TEXTURE,
    "in vec2 uv;",
    GLES_MAIN_BEGIN,
    "fc = col * texture(tex, uv);",
    GLES_MAIN_END,
].join("");
const GLES_VS_MESH = [
    "layout (location = 0) in vec3 position;",
    "layout (location = 1) in vec4 color;",
    "uniform mat4 world;",
    "uniform mat4 viewProj;",
    "out vec4 col;",
    GLES_MAIN_BEGIN,
    "gl_Position = viewProj * world * vec4(position, 1);",
    "col = color;",
    GLES_MAIN_END,
].join("");
const GLES_FS_MESH = [
    GLES_FS_PRECISION,
    GLES_FS_OUTPUT,
    "in vec4 col;",
    GLES_MAIN_BEGIN,
    "fc = col;",
    GLES_MAIN_END,
].join("");

const LINKAGE_MAP = new Map([
    ["rect", {vs: GLES_VS_RECT, fs: GLES_FS_RECT, attr: [], uniform: ["xywh", "col"]}],
    ["rect_tex", {vs: GLES_VS_RECT, fs: GLES_FS_RECT_TEX, attr: [], uniform: ["xywh", "col", "tex"]}],
    ["mesh", {vs: GLES_VS_MESH, fs: GLES_FS_MESH, attr: ["position", "color"], uniform: ["viewProj", "world"]}],
]);

const makeGLShaderLinker = (gl) => {
    const createGLShader = (type, source) => {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, GLES_VERSION+source);
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
    const linkProgram = (l) => {
        const vs = createGLShader(gl.VERTEX_SHADER, l.vs);
        if(!vs) {
            return null;
        }
        const fs = createGLShader(gl.FRAGMENT_SHADER, l.fs);
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
        for(let a of l.attr) {
            obj[a] = gl.getAttribLocation(prog, a);
        }
        for(let u of l.uniform) {
            obj[u] = gl.getUniformLocation(prog, u);
        }
        return obj;
    };

    const linked = new Map();
    const link = (name) => {
        if(linked.has(name)) {
            return linked.get(name);
        } else {
            if(!LINKAGE_MAP.has(name)) {
                LOGGING && console.log("NOTFOUND: makeGLESProgram " + name);
                return null;
            }
            const prog = linkProgram(LINKAGE_MAP.get(name));
            if(!prog) {
                LOGGING && console.log("FAILED: makeGLESProgram " + name);
                return null;
            }
            linked.set(name, prog);
            return prog;
        }
    };
    return link;
};
