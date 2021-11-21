
const deg2rad = (deg) => {
    return (deg / 180) * Math.PI;
};

const xy_length = (x, y) => {
    return Math.sqrt(x*x + y*y);
};

const xy_normalize = (x, y) => {
    const l = xy_length(x, y);
    return l != 0 ? [x/l, y/l] : [0, 0];
};
