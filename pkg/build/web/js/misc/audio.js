
const audio_createContext = () => {
    const audio = new AudioContext();
    ASSERT && console.assert(audio !== null);
    listen(document.body, "click", (ev) => {
        audio.resume();
    });
    // const masterNode = audio.createGain();
    // masterNode.gain.value = masterVolume();
    // masterNode.connect(audio.destination);
    return audio;
};

const audio_masterVolume = () => {
    if(window.RPGAtsumaru) {
        return window.RPGAtsumaru.volume.getCurrentValue();
    }
    return 1.0;
};
