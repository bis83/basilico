
// {{ if .Logging }}
const LOG = (...args) => {
    console.log(...args);
};
// {{ else }}
const LOG = (...args) => {
};
// {{ end }}
