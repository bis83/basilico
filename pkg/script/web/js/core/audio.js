
var $audio = null;

const audio_init = () => {
  $audio = new AudioContext();
  ASSERT && console.assert($audio !== null);
};
