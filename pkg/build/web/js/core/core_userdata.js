
const makeCoreUserData = () => {
    let system = {};
    let data = [];

    const loadSystem = () => {
        const sys = localStorage.getItem("system");
        if(sys == null) {
            system = {};
            return false;
        }
        system = JSON.parse(sys);
        return true;
    };
    const saveSystem = () => {
        const sys = JSON.stringify(system);
        localStorage.setItem("system", sys);
    };
    const deleteSystem = () => {
        localStorage.removeItem("system");
    };

    const start = () => {
        if(!loadSystem()) {
            saveSystem();
        }
    };
    const tick = () => {
    };
    return {
        start: start,
        tick: tick,
        loadSystem: loadSystem,
        saveSystem: saveSystem,
        deleteSystem: deleteSystem,
    }
};
