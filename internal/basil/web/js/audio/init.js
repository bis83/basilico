let $__audio_context = null;

const $__audioInit = () => {
  $__audio_context = new AudioContext();
};

const $__audioResume = () => {
  if ($__audio_context !== "running") {
    $__audio_context.resume();
  }
};
