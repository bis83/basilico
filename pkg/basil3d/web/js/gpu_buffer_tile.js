
const $__gpuBufferTile = (app) => {
    const gpu = app.data.gpu;
    const device = gpu.device;

    let count = 0;
    for (const obj of $stageCurrent(app).tile) {
        const tile = $dataTile(app, obj.data);
        if (!tile) {
            continue;
        }
        if (!tile.content) {
            continue;
        }

        const w = gpu.canvas.width;
        const h = gpu.canvas.height;
        const u = ((w < h) ? w : h) / 100;
        const x0 = obj.x * u;
        const y0 = obj.y * u;
        const w0 = obj.w * u;
        const h0 = obj.h * u;
        for (const cont of tile.content) {
            if (cont.bg) {
                const r = cont.bg[0] * 255;
                const g = cont.bg[1] * 255;
                const b = cont.bg[2] * 255;
                const a = cont.bg[3] * 255;
                const xmin = x0 - w0 / 2;
                const xmax = x0 + w0 / 2;
                const ymin = y0 - h0 / 2;
                const ymax = y0 + h0 / 2;

                const buf0 = new Float32Array(2 * 6);
                const buf1 = new Uint8Array(4 * 6);
                buf0.set([
                    xmin, ymin,
                    xmin, ymax,
                    xmax, ymax,
                    xmin, ymin,
                    xmax, ymax,
                    xmax, ymin,
                ]);
                buf1.set([
                    r, g, b, a,
                    r, g, b, a,
                    r, g, b, a,
                    r, g, b, a,
                    r, g, b, a,
                    r, g, b, a,
                ]);

                device.queue.writeBuffer(gpu.cbuffer[4], count * 8, buf0);
                device.queue.writeBuffer(gpu.cbuffer[5], count * 4, buf1);
                count += 6;
                continue;
            }
        }
    }
    return count;
}
