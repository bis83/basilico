
const stack_set = (id, count) => {
    return (id << 0) | (count << 16);
};

const stack_get = (value) => {
    return [
        (value >> 0) & 0xFFFF,
        (value >> 16) & 0xFFFF
    ];
};
