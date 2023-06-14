
const basil3d_start = async (setup) => {
  if (!navigator.gpu) {
    html_show_message("ERROR: WebGPU not supported.")
    return;
  }

  const adapter = await navigator.gpu.requestAdapter();
  const device = await adapter.requestDevice();
  const canvasFormat = navigator.gpu.getPreferredCanvasFormat();

  const gpu = basil3d_gpu_create(device, canvasFormat);
  const app = basil3d_app_load(device);
  const scene = basil3d_scene_create();

  const canvas = html_canvas();
  const context = canvas.getContext("webgpu");
  context.configure({
    device: device,
    format: canvasFormat,
    alphaMode: "opaque",
  });

  const frame = () => {
    basil3d_gpu_on_frame_start(gpu, device, canvas);
    if (basil3d_app_is_loading(app)) {
      basil3d_gpu_on_frame_loading(gpu, device, context);
    } else {
      if (setup) {
        setup(app, scene);
        setup = null;
      }
      basil3d_gpu_on_frame_scene(gpu, device, context, canvas, scene, app);
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
};
