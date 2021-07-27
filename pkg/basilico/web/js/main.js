
class Runtime {
    constructor() {
        this.audio_ = new Core_Audio();
        this.graphics_ = new Core_Graphics();
        this.controller_ = new Core_Controller();
        this.data_ = new Core_Data();
        this.savedata_ = new Core_SaveData();

        if(!this.savedata_.load()) {
            this.savedata_.save();
        }
    }

    tick() {
        this.controller_.tick();
        this.audio_.render();
        this.graphics_.render();
        requestAnimationFrame(() => this.tick());
    }
}

window.onload = () => {
    const runtime = new Runtime();
    runtime.tick();
};
