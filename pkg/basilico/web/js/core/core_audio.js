
const masterVolume = () => {
    if(window.RPGAtsumaru) {
        return window.RPGAtsumaru.volume.getCurrentValue();
    }
    return 1.0;
};

const makeCoreAudio = () => {
    let isStarted = false;
    let context = null;
    let masterNode = null;

    const resume = () => {
        if(!context) {
            context = new AudioContext();
            ASSERT && console.assert(context !== null);
            masterNode = context.createGain();
            masterNode.gain.value = masterVolume();
            masterNode.connect(context.destination);
            isStarted = true;
        }
        context.resume();
    };

    // Objects
    const makeListener = () => {
        return {};
    };
    const makeEmitter = () => {
        return {};
    };

    const tick = () => {
    };
    return {
        tick: tick,
        resume: resume,
        makeListener: makeListener,
        makeEmitter: makeEmitter,
    };
};
