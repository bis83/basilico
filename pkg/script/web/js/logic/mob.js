
const mob_make = (no, x, y, h, ha, va) => {
    return {
        no: no,
        x: x,
        y: y,
        h: h,
        ha: ha||0,
        va: va||0,
    };
};

const mob_tick = (mob) => {
    const data = data_mob(mob.no);
    if(!data) {
        return;
    }
    if(data.action) {
        action_invoke(mob, data.action);
    }
};
