
const $timer = {
    t: performance.now(),
    dt: 0,
    n: 0,
};

const timer_tick = (time) => {  
    $timer.dt = (time - $timer.t) / 1000;
    $timer.t = time;
    $timer.n += 1;
};
