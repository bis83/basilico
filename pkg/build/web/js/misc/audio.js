
const masterVolume = () => {
    if(window.RPGAtsumaru) {
        return window.RPGAtsumaru.volume.getCurrentValue();
    }
    return 1.0;
};
