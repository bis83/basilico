
var $audio = null;

const audio_init = () => {
  $audio = new AudioContext();
  ASSERT && console.assert($audio !== null);
};

const audio_masterVolume = () => {
  if (window.RPGAtsumaru) {
    return window.RPGAtsumaru.volume.getCurrentValue();
  }
  return 1.0;
};
