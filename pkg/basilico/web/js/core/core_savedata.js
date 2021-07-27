
class Core_SaveData {
    constructor() {
        this.system_ = {};
    }

    load() {
        const system = localStorage.getItem("system");
        if(system == null) {
            this.system_ = {};
            return false;
        }
        this.system_ = JSON.parse(system);
        return true;
    }

    save() {
        const system = JSON.stringify(this.system_);
        localStorage.setItem("system", system);
    }

    delete() {
        localStorage.removeItem("system");
    }
}
