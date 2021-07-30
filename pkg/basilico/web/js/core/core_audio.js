
const makeCoreAudio = () => {
    let isStarted = false;
    let context = null;
    let masterNode = null;

    const resume = () => {
        if(!context) {
            context = new AudioContext();
            masterNode = context.createGain();
            masterNode.gain.value = 0.01;
            masterNode.connect(context.destination);
            isStarted = true;
        }
        context.resume();
    };
    const tick = () => {
    };

    document.body.addEventListener("click", (ev) => {
        resume();
    });
    return {
        tick: tick
    };
};
