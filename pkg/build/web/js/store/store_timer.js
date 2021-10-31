
// store
const store_timer = (store) => {
    store.timer = {
        prevTime: performance.now(),
        deltaTime: 0,
    };
};

// getter

// action
const store_timerTickAction = ({ timer }) => {  
    const time = performance.now();
    timer.deltaTime = (time - timer.prevTime) / 1000;
    timer.prevTime = time;
};
