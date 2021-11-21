
var $core = null;

const $core_load = () => {
    const path = "data/core.json";
    fetch(path).then(res => res.json()).then((json) => {
        $core = json;
    });
};
