
class Core_Audio {
    constructor() {
        this.isStarted_ = false;
        document.body.addEventListener("click", (ev) => {
            this.resume();
        });
    }

    resume() {
        if(!this.context_) {
            this.context_ = new AudioContext();
            this.masterNode_ = this.context_.createGain();
            this.masterNode_.gain.value = 0.01;
            this.masterNode_.connect(this.context_.destination);
            this.isStarted_ = true;
        }
        this.context_.resume();
    }

    render() {
    }
}
