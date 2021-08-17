
const layerDebugGrid = (engine, graphics) => {
    let prog = graphics.shader("mesh");
    let mesh = graphics.mesh.makeMesh(
        new Float32Array([
            -100,    0,    0,
            +100,    0,    0,
               0, -100,    0,
               0, +100,    0,
               0,    0, -100,
               0,    0, +100,
        ]),
        new Uint8Array([
            255,   0,   0, 255,
            255,   0,   0, 255,
              0, 255,   0, 255,
              0, 255,   0, 255,
              0,   0, 255, 255,
              0,   0, 255, 255,
        ]),
    );

    const eye = vec3make();
    vec3set(eye, 2, 2, 2);
    const at = vec3make();
    vec3set(at, 0, 0, 0);
    const up = vec3make();
    vec3set(up, 0, 1, 0);
    const fovy = Math.PI / 6;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 1000.0;

    const lookat = mat4make();
    mat4lookat(lookat, eye, at, up);
    LOGGING && console.log(lookat);

    const persp = mat4make();
    mat4perspective(persp, fovy, aspect, near, far);
    LOGGING && console.log(persp);

    const m = mat4make();
    mat4copy(m, lookat);
    mat4multiply(m, persp);
    LOGGING && console.log(m);

    const begin = () => {
    };
    const end = () => {
    };
    const draw = () => {
        if(!engine.active()) {
            return;
        }

        prog.use();
        const gl = graphics.gl();
        gl.uniformMatrix4fv(prog.viewProj, false, m);
        mesh.bind();
        gl.drawArrays(gl.LINES, 0, 6);
    };
    return {
        begin: begin,
        end: end,
        draw: draw,
    }
};
