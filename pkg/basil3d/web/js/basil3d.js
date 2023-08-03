
const basil3d_start = async (setup, update) => {
  if (!navigator.gpu) {
    html_show_message("ERROR: WebGPU not supported.")
    return;
  }

  const adapter = await navigator.gpu.requestAdapter();
  const device = await adapter.requestDevice();
  const canvasFormat = navigator.gpu.getPreferredCanvasFormat();

  const canvas = html_canvas();
  const context = canvas.getContext("webgpu");
  context.configure({
    device: device,
    format: canvasFormat,
    alphaMode: "opaque",
  });

  const gpu = basil3d_gpu_create(device, canvasFormat);
  const listen = basil3d_listen_create();
  const app = basil3d_app_load(device);
  const view = basil3d_view_create();

  const frame = (time) => {
    basil3d_listen_tick(listen, time);
    basil3d_gpu_on_frame_start(gpu, device, canvas);
    if (basil3d_app_is_loading(app)) {
      basil3d_gpu_on_frame_loading(gpu, device, context);
    } else {
      if (setup) {
        setup(app, view);
        setup = null;
      }
      if (update) {
        update(app, view, listen);
      }
      basil3d_gpu_on_frame_view(gpu, device, context, canvas, app, view);
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
};
