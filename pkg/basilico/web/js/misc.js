
const LOGGING = {{.Logging}}
const LOG = (...args) => {
    LOGGING && console.log(...args);
};
