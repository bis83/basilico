
const layerDebugGrid = (engine, graphics) => {
    let prog = graphics.shader("mesh");
    let mesh = graphics.mesh.makeMesh(
        new Float32Array([
            -10, 0, 0,
            +10, 0, 0,
            0, -10, 0,
            0, +10, 0,
            0, 0, -10,
            0, 0, +10,
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

    const m = makeMat44();
    identityMat44(m);

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
