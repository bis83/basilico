
const localstorage_get = (key, defaultValue) => {
    const data = localStorage.getItem(key);
    if(data == null) {
        return defaultValue || {};
    }
    return JSON.parse(data);
};

const localstorage_set = (key, data) => {
    const json = JSON.stringify(data);
    localStorage.setItem(key, json);
};

const localstorage_del = (key) => {
    localStorage.removeItem(key);
};
