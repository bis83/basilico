
class Core_Controller {
    constructor() {
        this.gamepad_ = null;
        this.isPointerLocked_ = false;
        this.lx_ = 0;
        this.ly_ = 0;
        this.rx_ = 0;
        this.ry_ = 0;
        this.lb_ = false;
        this.rb_ = false;
        this.lt_ = false;
        this.rt_ = false;
        this.ok_ = false;
        this.cancel_ = false;

        window.addEventListener("gamepadconnected", (ev) => {
            this.gamepad_ = ev.gamepad;
        });
        window.addEventListener("gamepaddisconnected", (ev) => {
            if(this.gamepad_ === ev.gamepad) {
                this.gamepad_ = null;
            }
        });
        document.addEventListener("pointerlockchange", (ev) => {
            this.isPointerLocked_ = document.pointerLockElement === document.body;
            ev.preventDefault();
        });
        document.body.addEventListener("click", (ev) => {
            ev.preventDefault();
        });
        document.addEventListener("keydown", (ev) => {
            if(!this.isPointerLocked_) {
                return;
            }
            ev.preventDefault();
        });
        document.addEventListener("keyup", (ev) => {
            if(!this.isPointerLocked_) {
                return;
            }
            ev.preventDefault();
        });
        document.body.addEventListener("mousedown", (ev) => {
            if(!this.isPointerLocked_) {
                return;
            }
            ev.preventDefault();
        });
        document.body.addEventListener("mouseup", (ev) => {
            if(!this.isPointerLocked_) {
                return;
            }
            ev.preventDefault();
        });
        document.body.addEventListener("mousemove", (ev) => {
            if(!this.isPointerLocked_) {
                return;
            }
            ev.preventDefault();
        });
        document.body.addEventListener("touchstart", (ev) => {
        });
        document.body.addEventListener("touchmove", (ev) => {
        });
        document.body.addEventListener("touchend", (ev) => {
        });
    }

    requestPointerLock() {
        if(!this.isPointerLocked_) {
            document.body.requestPointerLock();
        }
    }

    tick() {
        if(this.gamepad_) {
            const gamepads = navigator.getGamepads();
            this.gamepad_ = gamepads[gamepad.index];
            this.lx_ = Math.trunc(this.gamepad_[0] * 4) / 4;
            this.ly_ = Math.trunc(this.gamepad_[1] * 4) / 4;
            this.rx_ = Math.trunc(this.gamepad_[2] * 4) / 4;
            this.ry_ = Math.trunc(this.gamepad_[3] * 4) / 4;
        }
    }

    lx() {
        return this.lx_;
    }

    ly() {
        return this.ly_;
    }

    rx() {
        return this.rx_;
    }

    ry() {
        return this.ry_;
    }

    lb() {
        return this.lb_;
    }

    rb() {
        return this.rb_;
    }

    lt() {
        return this.lt_;
    }

    rt() {
        return this.rt_;
    }

    ok() {
        return this.ok_;
    }

    cancel() {
        return this.cancel_;
    }
}
