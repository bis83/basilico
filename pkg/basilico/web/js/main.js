
class Runtime {
    constructor() {
        this.controller_ = new Controller();
        this.canvas_ = new Canvas();
    }

    tick() {
        requestAnimationFrame(() => this.tick());
        this.controller_.tick();
        this.canvas_.render();
    }
}

window.onload = () => {
    const runtime = new Runtime();
    runtime.tick();
};
