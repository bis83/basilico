
const $__audioInit = () => {
    const audio = $$.audio;
    audio.context = new AudioContext();
};

const $__audioResume = () => {
    const audio = $$.audio;
    if (audio.context !== "running") {
        audio.context.resume();
    }
};
