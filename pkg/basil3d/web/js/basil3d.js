
const basil3d_start = async (setup, update) => {
  if (!navigator.gpu) {
    html_show_message("ERROR: WebGPU not supported.")
    return;
  }

  const app = {
    loading: 0,
    gpu: {
      bindGroupLayout: [],
      pipelineLayout: [],
      shaderModule: [],
      pipeline: [],
      sampler: [],
      bindGroup: [],
      cbuffer: [],
      gbuffer: [],
    },
    audio: {},
    listen: {
      timer: {
        t: performance.now(),
        dt: 0,
        n: 0,
      },
      gamepad: {
        index: null,
        lx: 0,
        ly: 0,
        rx: 0,
        ry: 0,
        b0: false,
        b1: false,
        b8: false,
        b9: false,
        lb: false,
        rb: false,
        lt: false,
        rt: false,
      },
      keyboard: {
        w: false,
        a: false,
        s: false,
        d: false,
        up: false,
        left: false,
        down: false,
        right: false,
        q: false,
        e: false,
        z: false,
        x: false,
        space: false,
        lctrl: false,
        esc: false,
      },
      touch: new Map(),
    },
    json: {},
    view: {},
  };

  app.gpu.adapter = await navigator.gpu.requestAdapter();
  app.gpu.device = await app.gpu.adapter.requestDevice();
  app.gpu.canvasFormat = navigator.gpu.getPreferredCanvasFormat();
  app.gpu.canvas = html_canvas();
  app.gpu.context = app.gpu.canvas.getContext("webgpu");
  app.gpu.context.configure({
    device: app.gpu.device,
    format: app.gpu.canvasFormat,
    alphaMode: "opaque",
  });
  basil3d_gpu_init(app.gpu);
  basil3d_listen_init(app.listen);
  basil3d_view_reset(app.view);

  basil3d_app_load(app);
  const frame = (time) => {
    basil3d_listen_tick(app.listen, time);
    basil3d_gpu_on_frame_start(app.gpu);
    if (basil3d_app_is_loading(app)) {
      basil3d_gpu_on_frame_loading(app.gpu);
    } else {
      if (setup) {
        setup(app);
        setup = null;
      }
      if (update) {
        update(app);
      }
      basil3d_gpu_on_frame_view(app.gpu, app.view);
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
};
