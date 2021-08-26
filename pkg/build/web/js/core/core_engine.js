
const makeCoreEngine = () => {
    let frameCount = 0;
    let deltaTime = 0;
    let currentTime = 0;
    let active = false;

    const tick = (time) => {
        frameCount += 1;
        deltaTime = time - currentTime;
        currentTime = time;
    };
    const resume = () => {
        active = true;
    };
    const suspend = () => {
        active = false;
    };

    const begin = () => {
    };
    const execute = () => {
    };
    const end = () => {
    };
    return {
        tick: tick,
        resume: resume,
        suspend: suspend,
        active: () => active,
        begin: begin,
        execute: execute,
        end: end,
    }
};
